import Icon from './ui/Icon.jsx';
import { site } from '../config/site.js';
import { onAnchor } from '../lib/scroll.js';
import './Guarantee.css';

/**
 * Exibida quando site.guarantee.confirmed = true (padrão).
 */
export default function Guarantee() {
  const { confirmed, days } = site.guarantee;
  if (!confirmed && !site.demoMode) return null;

  return (
    <section id="garantia" className="section guarantee" aria-labelledby="guarantee-title">
      <div className="container">
        <div className="guarantee__box reveal">
          <div className="seal" aria-hidden="true">
            <svg viewBox="0 0 200 200" className="seal__ring">
              <defs>
                <path id="seal-circle" d="M100 100 m-78 0 a78 78 0 1 1 156 0 a78 78 0 1 1 -156 0" />
              </defs>
              <text>
                <textPath href="#seal-circle" startOffset="0">
                  GARANTIA • V PRIME PRO • GARANTIA • V PRIME PRO •
                </textPath>
              </text>
            </svg>
            <div className="seal__core">
              <Icon name="shield" />
              <strong>{days}</strong>
              <span>dias</span>
            </div>
          </div>

          <div className="guarantee__copy">
            <span className="eyebrow">Garantia</span>
            <h2 id="guarantee-title">
              Você tem <span className="grad-text">{days} dias para decidir.</span>
            </h2>
            <p>
              Assine, instale e assista por {days} dias a partir do primeiro acesso. Se não gostar, peça o reembolso do valor
              pago dentro do prazo. Durante esse tempo, o risco fica com a gente.
            </p>
            <a href="#planos" className="btn btn--ghost btn--sm" onClick={onAnchor('planos')}>
              Ver os planos
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
