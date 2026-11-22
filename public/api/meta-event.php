<?php
/**
 * POST /api/meta-event.php
 * Recebe do navegador os eventos PageView, ViewContent e InitiateCheckout
 * (somente de visitantes que aceitaram os cookies) e repassa à
 * Conversions API com o MESMO event_id usado pelo Pixel (deduplicação).
 *
 * Valores de compra NÃO vêm do navegador: o servidor usa a própria tabela de planos.
 */
declare(strict_types=1);
require __DIR__ . '/lib/bootstrap.php';

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    vp_json(405, ['ok' => false]);
    exit;
}

// Só aceita chamadas do próprio site
$origin = $_SERVER['HTTP_ORIGIN'] ?? ($_SERVER['HTTP_REFERER'] ?? '');
if (!vp_host_allowed($origin)) {
    vp_json(403, ['ok' => false]);
    exit;
}

$in = vp_read_body(8192);
if (isset($in['__too_large'])) {
    vp_json(413, ['ok' => false]);
    exit;
}

$allowed = ['PageView', 'ViewContent', 'InitiateCheckout'];
$name = (string)($in['event_name'] ?? '');
$eventId = (string)($in['event_id'] ?? '');
$sourceUrl = mb_substr((string)($in['event_source_url'] ?? ''), 0, 1000);

if (!in_array($name, $allowed, true)
    || !preg_match('/^[a-z]+\.[A-Za-z0-9-]{8,64}$/', $eventId)
    || !vp_host_allowed($sourceUrl)) {
    vp_json(400, ['ok' => false]);
    exit;
}

// Dados técnicos do navegador (sem dados pessoais diretos)
$userData = array_filter([
    'client_ip_address' => vp_client_ip(),
    'client_user_agent' => mb_substr((string)($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 500) ?: null,
]);
$fbp = (string)($_COOKIE['_fbp'] ?? ($in['fbp'] ?? ''));
$fbc = (string)($_COOKIE['_fbc'] ?? ($in['fbc'] ?? ''));
if (preg_match('/^fb\.\d\.\d+\.\d+$/', $fbp)) {
    $userData['fbp'] = $fbp;
}
if (preg_match('/^fb\.\d\.\d+\.[\w-]{10,500}$/', $fbc)) {
    $userData['fbc'] = $fbc;
}

// custom_data montado no servidor
$customData = [];
if ($name === 'ViewContent') {
    $customData = [
        'content_name'     => 'Planos V PRIME PRO',
        'content_category' => 'Planos',
        'content_ids'      => array_keys(vp_plans()),
        'content_type'     => 'product',
        'currency'         => 'BRL',
    ];
} elseif ($name === 'InitiateCheckout') {
    $planId = (string)($in['plan_id'] ?? '');
    $plans = vp_plans();
    if (!isset($plans[$planId])) {
        vp_json(400, ['ok' => false]);
        exit;
    }
    $customData = [
        'content_ids'  => [$planId],
        'content_name' => 'Plano ' . $plans[$planId]['name'],
        'content_type' => 'product',
        'num_items'    => 1,
        'value'        => $plans[$planId]['price'],
        'currency'     => 'BRL',
    ];
}

$event = [
    'event_name'       => $name,
    'event_time'       => time(),
    'event_id'         => $eventId,
    'action_source'    => 'website',
    'event_source_url' => $sourceUrl,
    'user_data'        => $userData,
];
if ($customData) {
    $event['custom_data'] = $customData;
}

// Responde já ao navegador; o envio à Meta continua em segundo plano
vp_json(204);
vp_finish_response();

$result = vp_capi_send([$event]);
if (!$result['ok']) {
    vp_log('capi', 'falha ao enviar evento', [
        'event'  => $name,
        'status' => $result['status'],
        'error'  => $result['error'] ?? '',
    ]);
}
