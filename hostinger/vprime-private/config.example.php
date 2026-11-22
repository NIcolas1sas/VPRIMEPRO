<?php
/**
 * CONFIGURAÇÃO PRIVADA DO BACKEND — V PRIME PRO (Hostinger)
 *
 * 1. Copie este arquivo como "config.php" (sem ".example").
 * 2. Envie para a pasta "vprime-private", AO LADO do public_html (NUNCA dentro dele):
 *      domains/seudominio.com/public_html/        ← site
 *      domains/seudominio.com/vprime-private/config.php   ← este arquivo
 * 3. Preencha os valores reais SOMENTE no servidor. Não salve o token
 *    neste projeto, não envie por e-mail/chat e não versione no Git.
 *
 * Os valores abaixo são FICTÍCIOS.
 */
return [
    // Meta
    'META_PIXEL_ID'          => '1461637372773478',
    'META_CAPI_ACCESS_TOKEN' => 'COLE_AQUI_O_TOKEN_DA_API_DE_CONVERSOES',
    'META_GRAPH_VERSION'     => 'v26.0',
    'META_TEST_EVENT_CODE'   => '', // ex.: 'TEST12345' durante os testes; deixe vazio em produção

    // Site
    'SITE_URL'           => 'https://seudominio.com.br',
    'SITE_ALLOWED_HOSTS' => 'seudominio.com.br,www.seudominio.com.br',

    // Braip (Ferramentas > Postback > Documentação > Chave única)
    'BRAIP_POSTBACK_KEY'  => 'COLE_AQUI_A_CHAVE_UNICA_DO_POSTBACK',
    'BRAIP_POSTBACK_MODE' => 'inspect', // troque para 'live' após conferir o braip-inspect.log

    // Nomes dos campos do postback — ajuste se o log mostrar nomes diferentes
    'BRAIP_AUTH_FIELD'        => 'basic_authentication',
    'BRAIP_TRANSACTION_FIELD' => 'trans_key',
    'BRAIP_STATUS_FIELD'      => 'trans_status',
    'BRAIP_APPROVED_STATUSES' => 'Pagamento Aprovado',
    'BRAIP_PLAN_FIELD'        => 'plan_key',
    'BRAIP_EMAIL_FIELD'       => 'client_email',
    'BRAIP_PHONE_FIELD'       => 'client_cel',
    'BRAIP_NAME_FIELD'        => 'client_name',
];
