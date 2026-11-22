# Meta Pixel + Conversions API — instalação na Hostinger

## Como funciona

| Evento | Quando dispara | Pixel (navegador) | Conversions API (servidor) |
|---|---|---|---|
| PageView | Ao abrir o site (1 vez por carregamento) | ✅ | ✅ `/api/meta-event.php` |
| ViewContent | Quando a seção de planos aparece | ✅ | ✅ `/api/meta-event.php` |
| InitiateCheckout | Clique em "Garantir meu plano" (147 / 247 / 327, BRL) | ✅ | ✅ `/api/meta-event.php` |
| Purchase | **Somente** pagamento aprovado na Braip | — | ✅ `/api/braip-webhook.php` |

- Navegador e servidor usam o **mesmo `event_id`**: a Meta conta uma vez só.
- Purchase usa `event_id = purchase.<transação Braip>` e trava por transação: postbacks repetidos não duplicam.
- Nada é carregado antes do visitante aceitar os cookies (aviso no rodapé da tela).
- O valor do InitiateCheckout e do Purchase vem da tabela de planos do servidor, nunca do navegador.

## Passo a passo

1. Rode `npm run build` e envie **todo o conteúdo de `dist/`** para `public_html`
   (inclui `api/meta-event.php`, `api/braip-webhook.php`, `api/lib/` e os `.htaccess`).
2. No Gerenciador de Arquivos, crie a pasta `vprime-private` **ao lado** de `public_html`:
   ```
   domains/seudominio.com.br/public_html/
   domains/seudominio.com.br/vprime-private/config.php
   ```
3. Copie `hostinger/vprime-private/config.example.php` para `vprime-private/config.php`
   e preencha **no servidor**:
   - `META_CAPI_ACCESS_TOKEN` — Gerenciador de Eventos > Pixel > Configurações > API de Conversões > Gerar token
   - `SITE_URL` e `SITE_ALLOWED_HOSTS` — seu domínio
   - `BRAIP_POSTBACK_KEY` — Braip > Ferramentas > Postback > Documentação > Chave única
4. PHP 8.0 ou superior (hPanel > Avançado > Configuração do PHP), com a extensão `curl` ativa.

## Testar (Gerenciador de Eventos > Testar eventos)

1. Copie o código de teste (ex.: `TEST12345`) para `META_TEST_EVENT_CODE` no `config.php`.
2. Abra o site, aceite os cookies, role até os planos e clique em um plano.
3. Devem aparecer PageView, ViewContent e InitiateCheckout com **Navegador** e **Servidor**,
   marcados como deduplicados.
4. Ao terminar, **apague** o `META_TEST_EVENT_CODE`.

Falhas de envio ficam em `vprime-private/data/capi.log` (sem token e sem dados pessoais).

## Ativar o Purchase (Braip)

A Braip não publica a estrutura do postback, então o webhook começa em **modo inspeção**:
recebe, valida a chave e registra os nomes dos campos, **sem enviar nada à Meta**.

1. Na Braip: Ferramentas > Postback > Nova configuração
   - URL: `https://seudominio.com.br/api/braip-webhook.php`
   - Método: POST
   - Produto: V PRIME PRO; eventos: alterações de status da venda
2. Faça uma venda de teste (ou use o teste de postback da Braip, se disponível).
3. Abra `vprime-private/data/braip-inspect.log` e confira:
   - o nome do campo da chave (padrão `basic_authentication`);
   - o código da transação (padrão `trans_key`);
   - o status de pagamento aprovado (padrão `trans_status` = `Pagamento Aprovado`);
   - o código do plano (padrão `plan_key`): deve ser `pla89wg2`, `plaq426r` ou `plajeygo`.
   Se algum nome for diferente, ajuste os campos `BRAIP_*` no `config.php`.
4. Troque `BRAIP_POSTBACK_MODE` para `live`.

⚠️ **Evite Purchase em dobro:** se o Pixel também estiver configurado **dentro da Braip**
(configurações de pixel do produto/checkout), desative lá o evento de compra (Purchase).
Senão, a Meta recebe duas compras com IDs diferentes e conta duas vezes.

## Observações

- O Purchase usa o valor do plano (147 / 247 / 327). Juros de parcelamento não entram.
- Reembolsos e chargebacks não geram evento (a Meta não tem "estorno" na CAPI).
- O comprador é identificado na Meta por e-mail, telefone e nome **em SHA-256**.
  Informe esse uso na Política de privacidade do site.
