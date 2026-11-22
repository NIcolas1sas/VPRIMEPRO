/**
 * ============================================================
 *  RASTREAMENTO META — Pixel (navegador) + Conversions API (servidor)
 * ============================================================
 *  - O Pixel carrega ao abrir o site (sem aviso de cookies, por decisão
 *    do projeto em 22/11/2026).
 *  - Cada evento recebe UM event_id, usado pelo Pixel E pelo servidor
 *    (/api/meta-event.php). A Meta junta os dois e conta uma vez só.
 *  - O token da Conversions API fica SOMENTE no servidor. Aqui só
 *    existe o ID do Pixel, que é público por natureza.
 *  - Purchase NÃO é disparado aqui: vem do webhook da Braip
 *    (/api/braip-webhook.php), após pagamento confirmado.
 * ============================================================
 */
import { site } from '../config/site.js';

const env = import.meta.env;

export const tracking = {
  pixelId: env.VITE_META_PIXEL_ID || '1461637372773478',
  // Endpoint PHP na Hostinger. Em "npm run dev" não há PHP: o envio ao servidor é ignorado.
  capiEndpoint: env.VITE_META_CAPI_ENDPOINT || '/api/meta-event.php',
  capiEnabled: env.VITE_META_CAPI_ENABLED ? env.VITE_META_CAPI_ENABLED !== 'false' : !env.DEV,
};

/* ---------------- Utilidades ---------------- */
export function newEventId(prefix = 'ev') {
  const rand =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  return `${prefix}.${rand}`;
}

function readCookie(name) {
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : undefined;
}

/* ---------------- Pixel (carregado uma única vez) ---------------- */
let pixelLoaded = false;

function loadPixel() {
  if (pixelLoaded || typeof window === 'undefined') return;
  pixelLoaded = true;
  if (!window.fbq) {
    /* Snippet oficial da Meta (base code), sem alterações de comportamento */
    /* eslint-disable */
    !(function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */
  }
  window.fbq('init', tracking.pixelId);
}

/* ---------------- Envio ao servidor (Conversions API) ---------------- */
function sendToServer(payload) {
  if (!tracking.capiEnabled) return;
  const body = JSON.stringify({
    ...payload,
    event_source_url: window.location.href.split('#')[0],
    fbp: readCookie('_fbp'),
    fbc: readCookie('_fbc'),
  });
  try {
    fetch(tracking.capiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true, // continua mesmo se a aba mudar (ex.: abrir o checkout)
      credentials: 'same-origin',
    }).catch(() => {});
  } catch {
    /* rastreamento nunca pode quebrar a página */
  }
}

/** Dispara um evento no Pixel e no servidor com o MESMO event_id. */
export function track(eventName, customData = {}, extra = {}) {
  if (typeof window === 'undefined') return null;
  loadPixel();
  const eventId = newEventId(eventName.toLowerCase());
  window.fbq('track', eventName, customData, { eventID: eventId });
  sendToServer({ event_name: eventName, event_id: eventId, custom_data: customData, ...extra });
  return eventId;
}

/* ---------------- Eventos do site ---------------- */
let pageViewSent = false;

/** PageView: uma vez por carregamento (o site é uma página única, sem troca de rota). */
export function trackPageView() {
  if (pageViewSent) return;
  pageViewSent = true;
  track('PageView');
}

let viewContentSent = false;

/** ViewContent: quando a seção de planos (a oferta) aparece na tela. Uma vez por visita à página. */
export function trackViewContent() {
  if (viewContentSent) return;
  viewContentSent = true;
  track('ViewContent', {
    content_name: 'Planos V PRIME PRO',
    content_category: 'Planos',
    content_ids: site.plans.map((p) => p.id),
    content_type: 'product',
    currency: 'BRL',
  });
}

/** Alias usado pela seção de planos. */
export const markOfferSeen = trackViewContent;

/** InitiateCheckout: clique no botão de contratação de um plano. */
export function trackInitiateCheckout(plan) {
  track(
    'InitiateCheckout',
    {
      content_ids: [plan.id],
      content_name: `Plano ${plan.name}`,
      content_type: 'product',
      num_items: 1,
      value: plan.price,
      currency: 'BRL',
    },
    { plan_id: plan.id }
  );
}

/** Chamado uma vez ao abrir o site. */
export function initTracking() {
  loadPixel();
  trackPageView();
}
