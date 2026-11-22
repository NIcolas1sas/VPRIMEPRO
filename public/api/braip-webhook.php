<?php
/**
 * POST /api/braip-webhook.php  — Postback da Braip → Purchase na Conversions API
 *
 * MODO "inspect" (padrão): NÃO envia nada para a Meta. Apenas valida a chave
 *   e registra os NOMES dos campos recebidos (e valores não pessoais, como
 *   status e plano) em vprime-private/data/braip-inspect.log, para confirmar
 *   a estrutura real do postback antes de ativar.
 * MODO "live": envia Purchase SOMENTE quando o status for de pagamento aprovado.
 *
 * Proteções:
 *  - Chave única da Braip obrigatória (comparação em tempo constante);
 *  - Cada transação gera Purchase uma única vez (trava em arquivo + event_id
 *    fixo "purchase.<transação>", que a Meta também deduplica);
 *  - E-mail, telefone e nome vão para a Meta somente em SHA-256 e nunca são registrados em log.
 */
declare(strict_types=1);
require __DIR__ . '/lib/bootstrap.php';

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    vp_json(405, ['ok' => false]);
    exit;
}

$data = vp_read_body(65536);
if (isset($data['__too_large'])) {
    vp_json(413, ['ok' => false]);
    exit;
}

$field = static fn (string $cfgKey): string => trim((string)($data[(string)vp_config($cfgKey)] ?? ''));

/* ---------- 1. Autenticação ---------- */
$expectedKey = (string)vp_config('BRAIP_POSTBACK_KEY', '');
if ($expectedKey === '') {
    vp_log('braip', 'postback recusado: BRAIP_POSTBACK_KEY não configurada');
    vp_json(503, ['ok' => false, 'error' => 'not_configured']);
    exit;
}
$receivedKey = $field('BRAIP_AUTH_FIELD');
if ($receivedKey === '' || !hash_equals($expectedKey, $receivedKey)) {
    // registra só os nomes dos campos, para ajudar a localizar o campo da chave
    vp_log('braip-inspect', 'autenticação falhou', ['campos' => array_keys($data)]);
    vp_json(401, ['ok' => false]);
    exit;
}

$mode = strtolower((string)vp_config('BRAIP_POSTBACK_MODE', 'inspect'));
$transaction = $field('BRAIP_TRANSACTION_FIELD');
$status = $field('BRAIP_STATUS_FIELD');
$planCode = $field('BRAIP_PLAN_FIELD');

/* ---------- 2. Modo inspeção: só registra a estrutura ---------- */
if ($mode !== 'live') {
    $safe = [];
    foreach ($data as $k => $v) {
        // valores liberados apenas para campos técnicos (nunca dados do comprador)
        $isPersonal = preg_match('/client|cliente|email|mail|cel|phone|fone|tel|nome|name|doc|cpf|cnpj|address|endereco|street|zip|cep|ip/i', (string)$k);
        $safe[$k] = $isPersonal ? '[oculto]' : (is_scalar($v) ? mb_substr((string)$v, 0, 80) : '[lista]');
    }
    unset($safe[(string)vp_config('BRAIP_AUTH_FIELD')]);
    vp_log('braip-inspect', 'postback recebido (modo inspeção, nada enviado à Meta)', $safe);
    vp_json(200, ['ok' => true, 'mode' => 'inspect']);
    exit;
}

/* ---------- 3. Modo live: Purchase só com pagamento aprovado ---------- */
$approved = array_filter(array_map(
    static fn ($s) => mb_strtolower(trim($s), 'UTF-8'),
    explode(',', (string)vp_config('BRAIP_APPROVED_STATUSES', 'Pagamento Aprovado'))
));
if ($transaction === '' || !in_array(mb_strtolower($status, 'UTF-8'), $approved, true)) {
    vp_log('braip', 'ignorado: não é pagamento aprovado', ['status' => mb_substr($status, 0, 60)]);
    vp_json(200, ['ok' => true, 'ignored' => 'status']);
    exit;
}

$plan = vp_plan_by_braip($planCode);
if ($plan === null) {
    vp_log('braip', 'ignorado: plano desconhecido', ['plano' => mb_substr($planCode, 0, 40)]);
    vp_json(200, ['ok' => true, 'ignored' => 'plan']);
    exit;
}

$lockKey = 'braip:' . $transaction;
if (!vp_claim($lockKey)) {
    vp_json(200, ['ok' => true, 'duplicate' => true]);
    exit;
}

/* ---------- 4. Dados do comprador (somente hash) ---------- */
$phoneDigits = preg_replace('/\D/', '', $field('BRAIP_PHONE_FIELD'));
if ($phoneDigits !== '' && strlen($phoneDigits) <= 11) {
    $phoneDigits = '55' . $phoneDigits; // padrão Meta: com código do país
}
$nameParts = preg_split('/\s+/', $field('BRAIP_NAME_FIELD'), -1, PREG_SPLIT_NO_EMPTY) ?: [];

$userData = array_filter([
    'em'          => [vp_hash($field('BRAIP_EMAIL_FIELD'))],
    'ph'          => [vp_hash($phoneDigits)],
    'fn'          => [vp_hash($nameParts[0] ?? null)],
    'ln'          => [vp_hash(count($nameParts) > 1 ? end($nameParts) : null)],
    'country'     => [vp_hash('br')],
    'external_id' => [vp_hash($field('BRAIP_EMAIL_FIELD'))],
], static fn ($v) => $v[0] !== null);

$siteUrl = (string)vp_config('SITE_URL', '');
if ($siteUrl === '') {
    $siteUrl = 'https://' . (string)($_SERVER['HTTP_HOST'] ?? '');
}

$event = [
    'event_name'       => 'Purchase',
    'event_time'       => time(),
    'event_id'         => 'purchase.' . $transaction,
    'action_source'    => 'website',
    'event_source_url' => rtrim($siteUrl, '/') . '/',
    'user_data'        => $userData,
    'custom_data'      => [
        'value'        => $plan['price'],
        'currency'     => 'BRL',
        'content_ids'  => [$plan['id']],
        'content_name' => 'Plano ' . $plan['name'],
        'content_type' => 'product',
        'num_items'    => 1,
        'order_id'     => $transaction,
    ],
];

$result = vp_capi_send([$event]);
if (!$result['ok']) {
    vp_release($lockKey); // permite que a Braip reenvie e o Purchase seja tentado de novo
    vp_log('braip', 'falha ao enviar Purchase', ['status' => $result['status'], 'error' => $result['error'] ?? '']);
    vp_json(500, ['ok' => false]);
    exit;
}

vp_log('braip', 'Purchase enviado', ['plano' => $plan['id'], 'valor' => $plan['price']]);
vp_json(200, ['ok' => true]);
