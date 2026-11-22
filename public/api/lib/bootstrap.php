<?php
/**
 * V PRIME PRO — base do backend (Hostinger / PHP 8+)
 * Conversions API da Meta + webhook da Braip.
 *
 * SEGREDOS: nada sensível fica neste arquivo nem dentro de public_html.
 * A configuração é lida, nesta ordem:
 *   1. Variáveis de ambiente do servidor (getenv), se existirem;
 *   2. Arquivo privado FORA do public_html:
 *        <pasta do domínio>/vprime-private/config.php
 *      (ex.: /home/u123/domains/seudominio.com/vprime-private/config.php)
 *      ou o caminho informado em VPRIME_CONFIG.
 */
declare(strict_types=1);

if (!defined('VPRIME')) {
    define('VPRIME', true);
}

/* ---------------- Configuração ---------------- */

function vp_private_dir(): string
{
    $docRoot = rtrim((string)($_SERVER['DOCUMENT_ROOT'] ?? ''), '/\\');
    return $docRoot !== '' ? dirname($docRoot) . DIRECTORY_SEPARATOR . 'vprime-private' : sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'vprime-private';
}

function vp_config(string $key, $default = null)
{
    static $cfg = null;
    if ($cfg === null) {
        $cfg = [
            'META_PIXEL_ID'           => '1461637372773478',
            'META_CAPI_ACCESS_TOKEN'  => '',
            'META_GRAPH_VERSION'      => 'v26.0',
            'META_TEST_EVENT_CODE'    => '',          // ex.: TEST12345 (só durante testes)
            'SITE_URL'                => '',          // ex.: https://seudominio.com
            'SITE_ALLOWED_HOSTS'      => '',          // ex.: seudominio.com,www.seudominio.com
            'BRAIP_POSTBACK_KEY'      => '',          // chave única: Braip > Ferramentas > Postback > Documentação
            'BRAIP_POSTBACK_MODE'     => 'inspect',   // inspect = só registra | live = envia Purchase
            'BRAIP_AUTH_FIELD'        => 'basic_authentication',
            'BRAIP_TRANSACTION_FIELD' => 'trans_key',
            'BRAIP_STATUS_FIELD'      => 'trans_status',
            'BRAIP_APPROVED_STATUSES' => 'Pagamento Aprovado',
            'BRAIP_PLAN_FIELD'        => 'plan_key',
            'BRAIP_EMAIL_FIELD'       => 'client_email',
            'BRAIP_PHONE_FIELD'       => 'client_cel',
            'BRAIP_NAME_FIELD'        => 'client_name',
            'VPRIME_DATA_DIR'         => '',
        ];
        $file = getenv('VPRIME_CONFIG') ?: vp_private_dir() . DIRECTORY_SEPARATOR . 'config.php';
        if (is_file($file) && is_readable($file)) {
            $fromFile = include $file;
            if (is_array($fromFile)) {
                $cfg = array_merge($cfg, $fromFile);
            }
        }
        foreach (array_keys($cfg) as $k) {
            $v = getenv($k);
            if ($v !== false && $v !== '') {
                $cfg[$k] = $v;
            }
        }
    }
    return $cfg[$key] ?? $default;
}

/** Planos: id do site → nome, valor e código do plano na Braip (parâmetro "pl" do link). */
function vp_plans(): array
{
    return [
        'individual' => ['name' => 'Individual', 'price' => 147.00, 'braip' => 'pla89wg2'],
        'familia'    => ['name' => 'Família',    'price' => 247.00, 'braip' => 'plaq426r'],
        'premium'    => ['name' => 'Premium',    'price' => 327.00, 'braip' => 'plajeygo'],
    ];
}

function vp_plan_by_braip(string $code): ?array
{
    foreach (vp_plans() as $id => $p) {
        if (hash_equals($p['braip'], $code)) {
            return $p + ['id' => $id];
        }
    }
    return null;
}

/* ---------------- Respostas e registros ---------------- */

function vp_json(int $status, array $body = []): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    if ($status !== 204) {
        echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }
}

/** Libera a resposta ao navegador e continua o processamento (PHP-FPM / LiteSpeed). */
function vp_finish_response(): void
{
    if (function_exists('litespeed_finish_request')) {
        litespeed_finish_request();
    } elseif (function_exists('fastcgi_finish_request')) {
        fastcgi_finish_request();
    } else {
        @ob_end_flush();
        @flush();
    }
}

function vp_data_dir(): string
{
    $dir = (string)vp_config('VPRIME_DATA_DIR', '');
    if ($dir === '') {
        $dir = vp_private_dir() . DIRECTORY_SEPARATOR . 'data';
    }
    if (!is_dir($dir)) {
        @mkdir($dir, 0700, true);
    }
    if (!is_dir($dir) || !is_writable($dir)) {
        $dir = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'vprime-data';
        if (!is_dir($dir)) {
            @mkdir($dir, 0700, true);
        }
    }
    return $dir;
}

/**
 * Registro técnico SEM dados pessoais e SEM token.
 * Mantém o arquivo pequeno (máx. ~200 KB).
 */
function vp_log(string $channel, string $message, array $context = []): void
{
    $file = vp_data_dir() . DIRECTORY_SEPARATOR . $channel . '.log';
    if (is_file($file) && filesize($file) > 200000) {
        @rename($file, $file . '.old');
    }
    $line = gmdate('c') . ' ' . $message;
    if ($context) {
        $line .= ' ' . json_encode($context, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }
    @file_put_contents($file, $line . PHP_EOL, FILE_APPEND | LOCK_EX);
}

/* ---------------- Proteção contra duplicidade ---------------- */

/** Reserva uma chave de forma atômica. true = primeira vez; false = já processada. */
function vp_claim(string $key): bool
{
    $dir = vp_data_dir() . DIRECTORY_SEPARATOR . 'processed';
    if (!is_dir($dir)) {
        @mkdir($dir, 0700, true);
    }
    $fh = @fopen($dir . DIRECTORY_SEPARATOR . sha1($key) . '.lock', 'x');
    if ($fh === false) {
        return false;
    }
    fwrite($fh, gmdate('c'));
    fclose($fh);
    return true;
}

/** Libera a chave (usado quando o envio falha, para permitir nova tentativa). */
function vp_release(string $key): void
{
    @unlink(vp_data_dir() . DIRECTORY_SEPARATOR . 'processed' . DIRECTORY_SEPARATOR . sha1($key) . '.lock');
}

/* ---------------- Dados do visitante ---------------- */

/** SHA-256 de um dado pessoal normalizado (padrão exigido pela Meta). */
function vp_hash(?string $value): ?string
{
    if ($value === null) {
        return null;
    }
    $v = mb_strtolower(trim($value), 'UTF-8');
    return $v === '' ? null : hash('sha256', $v);
}

function vp_client_ip(): ?string
{
    $candidates = [];
    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $candidates = array_map('trim', explode(',', (string)$_SERVER['HTTP_X_FORWARDED_FOR']));
    }
    $candidates[] = (string)($_SERVER['REMOTE_ADDR'] ?? '');
    foreach ($candidates as $ip) {
        if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
            return $ip;
        }
    }
    $ip = (string)($_SERVER['REMOTE_ADDR'] ?? '');
    return filter_var($ip, FILTER_VALIDATE_IP) ? $ip : null;
}

/** Hosts autorizados a enviar eventos (o próprio domínio + SITE_ALLOWED_HOSTS). */
function vp_allowed_hosts(): array
{
    $hosts = array_filter(array_map('trim', explode(',', (string)vp_config('SITE_ALLOWED_HOSTS', ''))));
    $site = parse_url((string)vp_config('SITE_URL', ''), PHP_URL_HOST);
    if ($site) {
        $hosts[] = $site;
    }
    $self = strtolower(preg_replace('/:\d+$/', '', (string)($_SERVER['HTTP_HOST'] ?? '')));
    if ($self !== '') {
        $hosts[] = $self;
    }
    return array_values(array_unique(array_map('strtolower', $hosts)));
}

function vp_host_allowed(?string $url): bool
{
    if (!$url) {
        return false;
    }
    $host = strtolower((string)parse_url($url, PHP_URL_HOST));
    return $host !== '' && in_array($host, vp_allowed_hosts(), true);
}

/* ---------------- Envio para a Meta (Conversions API) ---------------- */

/**
 * Envia eventos para a Graph API por HTTPS.
 * Tenta de novo em falhas de rede, 429 ou 5xx — sempre com o MESMO event_id,
 * então a Meta descarta repetições e nada é contado em dobro.
 *
 * @return array{ok: bool, status: int, error?: string}
 */
function vp_capi_send(array $events): array
{
    $token = (string)vp_config('META_CAPI_ACCESS_TOKEN', '');
    $pixel = preg_replace('/\D/', '', (string)vp_config('META_PIXEL_ID', ''));
    if ($token === '' || $pixel === '') {
        return ['ok' => false, 'status' => 0, 'error' => 'not_configured'];
    }
    $version = preg_replace('/[^v0-9.]/', '', (string)vp_config('META_GRAPH_VERSION', 'v26.0'));
    $url = "https://graph.facebook.com/{$version}/{$pixel}/events";

    $payload = ['data' => array_values($events), 'access_token' => $token];
    $test = trim((string)vp_config('META_TEST_EVENT_CODE', ''));
    if ($test !== '') {
        $payload['test_event_code'] = $test;
    }
    $body = json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

    $status = 0;
    $error = '';
    for ($attempt = 1; $attempt <= 3; $attempt++) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => $body,
            CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CONNECTTIMEOUT => 4,
            CURLOPT_TIMEOUT        => 8,
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_SSL_VERIFYHOST => 2,
        ]);
        $response = curl_exec($ch);
        $status = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlError = curl_error($ch);
        curl_close($ch);

        if ($response !== false && $status >= 200 && $status < 300) {
            return ['ok' => true, 'status' => $status];
        }
        // Mensagem da Meta (nunca contém o token). Não registra o corpo enviado.
        $decoded = is_string($response) ? json_decode($response, true) : null;
        $error = $curlError !== ''
            ? 'curl: ' . $curlError
            : (string)($decoded['error']['message'] ?? ('HTTP ' . $status));
        if ($curlError === '' && $status !== 429 && $status < 500) {
            break; // erro definitivo (ex.: token inválido): não adianta repetir
        }
        usleep($attempt * 400000);
    }
    return ['ok' => false, 'status' => $status, 'error' => mb_substr($error, 0, 300)];
}

/** Lê o corpo da requisição (JSON ou formulário), com limite de tamanho. */
function vp_read_body(int $maxBytes): array
{
    $raw = (string)file_get_contents('php://input', false, null, 0, $maxBytes + 1);
    if (strlen($raw) > $maxBytes) {
        return ['__too_large' => true];
    }
    $type = strtolower((string)($_SERVER['CONTENT_TYPE'] ?? ''));
    if (str_contains($type, 'application/json')) {
        $data = json_decode($raw, true);
        return is_array($data) ? $data : [];
    }
    if (!empty($_POST)) {
        return $_POST;
    }
    $data = [];
    parse_str($raw, $data);
    return is_array($data) ? $data : [];
}
