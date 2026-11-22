# V PRIME PRO — Página de vendas

Site de página única em **Vite 5 + React 18**, sem bibliotecas de UI. Inclui intro animada, carrosséis,
3 VSLs do YouTube, contadores animados, seção de planos com checkout da Braip, Meta Pixel com consentimento
de cookies (LGPD) e backend PHP para a Conversions API e o webhook da Braip.

## Requisitos

- [Node.js](https://nodejs.org/) 18 ou superior (inclui o `npm`)
- Para publicar: hospedagem Hostinger com **PHP 8.0+** e extensão `curl` (padrão nos planos atuais)

## Instalar e gerar a versão de produção (CMD)

```
git clone https://github.com/NIcolas1sas/VPRIMEPRO.git
cd VPRIMEPRO
npm install
npm run build
```

O build cria a pasta **`dist/`**, com tudo o que vai para a hospedagem: HTML, CSS, JavaScript, imagens,
thumbnails das VSLs, logos e o backend PHP (`dist/api/`).

Outros comandos:

```
npm run dev       # desenvolvimento em http://localhost:5173
npm run preview   # testa o build de produção em http://localhost:4173
```

> **Não precisa de `.env` para publicar.** Sem `.env`, o build gera o site exatamente como está configurado
> (links da Braip, Pixel, vídeos e textos atuais). O `.env.example` lista o que pode ser personalizado.
>
> ⚠️ **Não use `VITE_DEMO_MODE=false`** sem antes confirmar os preços da comparação em
> `src/config/comparison.js` (campo `checkedAt`). Com ele desligado, a **seção de comparação** e o card
> **"Conteúdo adulto protegido por senha"** deixam de aparecer.

## Publicar na Hostinger

1. Rode `npm run build`.
2. No hPanel > **Gerenciador de Arquivos**, abra `public_html` e envie **todo o conteúdo de `dist/`**
   (não a pasta `dist` em si). Inclua os arquivos ocultos `.htaccess` de `dist/api/`.
3. Configure o backend (Conversions API e webhook da Braip): siga
   **[hostinger/META-PIXEL-CAPI.md](hostinger/META-PIXEL-CAPI.md)**.
   Resumo: crie `vprime-private/config.php` **ao lado** do `public_html` (nunca dentro dele), a partir de
   `hostinger/vprime-private/config.example.php`, e preencha o token **somente no servidor**.

O site é uma página única com âncoras (`#planos`, `#duvidas`…): não há rotas para configurar no servidor.

## O que depende de servidor

| Funcionalidade | Onde roda | Precisa configurar? |
|---|---|---|
| Site, animações, carrosséis, contadores | Navegador (arquivos estáticos) | Não |
| VSLs (YouTube) | Navegador — o player só carrega ao clicar no play | Não |
| Checkout (Braip) | Links diretos, abrem em nova aba | Não |
| Meta Pixel (PageView, ViewContent, InitiateCheckout) | Navegador, após aceite dos cookies | Não (ID já configurado) |
| Conversions API (mesmos eventos, pelo servidor) | `dist/api/meta-event.php` | **Sim**: token no `config.php` |
| Purchase (pagamento aprovado) | `dist/api/braip-webhook.php` | **Sim**: chave do postback + ativação (começa em modo inspeção) |

## Onde configurar

| O quê | Arquivo |
|---|---|
| Planos, preços, telas, links de checkout | `src/config/site.js` → `plans` |
| Contadores (+60.000, +500, +80.000) | `src/config/site.js` → `stats` |
| Benefícios dos planos | `src/config/site.js` → `planFeatures` |
| Depoimentos (prints) | `src/config/site.js` → `testimonials` (imagens em `public/testimonials/`) |
| VSLs do YouTube (ID + thumbnail) | `src/config/site.js` → `videos` (thumbnails em `public/videos/thumbs/`) |
| Perguntas frequentes | `src/config/faq.js` |
| Comparação de plataformas | `src/config/comparison.js` |
| Capas e categorias | `src/config/catalog.js`, `src/config/categories.js` |
| Cards da seção 3 | `src/config/features.js` |
| Meta Pixel (navegador) | `src/lib/tracking.js` (ID `1461637372773478`) |
| Backend PHP (planos ↔ códigos da Braip) | `public/api/lib/bootstrap.php` → `vp_plans()` |

Variáveis opcionais do build (arquivo `.env`, copie de `.env.example`): WhatsApp, e-mail de suporte,
dados da empresa, URLs de política de privacidade/termos/reembolso etc. Campos vazios não aparecem no site.

## Estrutura

```
public/            imagens, logos, thumbnails e backend PHP (copiados para dist/)
  api/             meta-event.php, braip-webhook.php, lib/ (bloqueada por .htaccess)
src/
  components/      seções do site (Hero, Pricing, FAQ…) e componentes de UI
  config/          conteúdo e configurações comerciais
  lib/             rolagem suave, ações (checkout/suporte) e rastreamento Meta
  styles/          estilos globais e animações de entrada
hostinger/         guia e exemplo de configuração privada do backend (NÃO vão para dist/)
```

## Segurança

- O token da Conversions API **nunca** fica no projeto, no `dist/` nem no navegador:
  só no `vprime-private/config.php` do servidor.
- `.env`, `config.php`, logs, `node_modules/` e `dist/` estão no `.gitignore`.

## Revisar a intro

- `/?intro=1` força a intro;
- `/?intro=1&etapa=logo`, `etapa=brand` ou `etapa=dissolve&t=500` congela uma etapa.
