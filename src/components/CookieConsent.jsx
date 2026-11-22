import { useEffect, useState } from 'react';
import { getConsent, setConsent, initTracking, onConsentChange } from '../lib/tracking.js';
import { site } from '../config/site.js';
import './CookieConsent.css';

/** Evento global para reabrir o aviso (link "Preferências de cookies" no rodapé). */
export const openCookiePreferences = () => window.dispatchEvent(new Event('vprime:cookies'));

/**
 * Aviso de cookies (LGPD). O Pixel da Meta só carrega após "Aceitar".
 * A escolha fica salva no navegador e pode ser alterada pelo rodapé.
 */
export default function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    initTracking();
    if (!getConsent()) {
      // aparece depois da intro, sem competir com a abertura do site
      const t = window.setTimeout(() => setOpen(true), 1800);
      return () => window.clearTimeout(t);
    }
    return undefined;
  }, []);

  useEffect(() => {
    const reopen = () => setOpen(true);
    window.addEventListener('vprime:cookies', reopen);
    const off = onConsentChange(() => setOpen(false));
    return () => {
      window.removeEventListener('vprime:cookies', reopen);
      off();
    };
  }, []);

  if (!open) return null;

  return (
    <div className="cookie" role="dialog" aria-live="polite" aria-label="Aviso de cookies">
      <p className="cookie__text">
        Usamos cookies para medir o desempenho dos nossos anúncios e melhorar sua experiência.
        {site.legal.privacy && (
          <>
            {' '}
            <a href={site.legal.privacy} target="_blank" rel="noopener noreferrer">
              Política de privacidade
            </a>
          </>
        )}
      </p>
      <div className="cookie__actions">
        <button type="button" className="cookie__btn cookie__btn--ghost" onClick={() => setConsent('denied')}>
          Recusar
        </button>
        <button type="button" className="cookie__btn cookie__btn--primary" onClick={() => setConsent('granted')}>
          Aceitar
        </button>
      </div>
    </div>
  );
}
