import { site } from '../config/site.js';
import { onAnchor } from '../lib/scroll.js';
import { openCookiePreferences } from './CookieConsent.jsx';
import './Footer.css';

/** Rodapé com duas áreas: marca + navegação. */
export default function Footer() {
  const { legalName, cnpj, address } = site.company;
  const companyLine = [legalName, cnpj && `CNPJ ${cnpj}`, address].filter(Boolean).join(' · ');
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <span className="footer__line" aria-hidden="true" />
      <div className="container">
        <div className="footer__grid reveal">
          <div className="footer__brand">
            <a href="#inicio" className="footer__logo" onClick={onAnchor('inicio')}>
              <img src={site.brand.symbol} alt="" width="220" height="199" loading="lazy" />
              <span>
                V PRIME <b>PRO</b>
              </span>
            </a>
            <p>{site.brand.description}</p>
          </div>

          <span className="footer__divider" aria-hidden="true" />

          <nav aria-label="Navegação do rodapé">
            <h3>Navegação</h3>
            <ul>
              {site.nav.map((n) => (
                <li key={n.id}>
                  <a href={`#${n.id}`} onClick={onAnchor(n.id)}>
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Dados da empresa: aparecem somente quando preenchidos no .env */}
        {companyLine && <p className="footer__company">{companyLine}</p>}

        <div className="footer__bottom">
          <p>
            © {year} {site.brand.name}. Todos os direitos reservados.
          </p>
          <p className="footer__muted">
            Imagens e interfaces exibidas nesta página são ilustrativas.{' '}
            <button type="button" className="footer__cookies" onClick={openCookiePreferences}>
              Preferências de cookies
            </button>
          </p>
        </div>
      </div>
    </footer>
  );
}
