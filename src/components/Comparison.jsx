import { useEffect, useRef, useState } from 'react';
import Icon from './ui/Icon.jsx';
import CountUp from './ui/CountUp.jsx';
import { site, formatBRL } from '../config/site.js';
import { comparison } from '../config/comparison.js';
import { onAnchor } from '../lib/scroll.js';
import './Comparison.css';

const perks = [
  { icon: 'film', label: 'Filmes e séries' },
  { icon: 'ball', label: 'Esportes ao vivo' },
  { icon: 'tv', label: 'Canais variados' },
  { icon: 'play', label: 'E muito mais' },
];

// Cálculos em centavos para evitar erros de arredondamento
const cents = (v) => Math.round(v * 100);

export default function Comparison() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) {
      setInView(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const verified = Boolean(comparison.checkedAt);
  // Preços não validados nunca vão ao ar: com demoMode desligado a seção some
  if (!verified && !site.demoMode) return null;

  const plan = site.plans.find((p) => p.id === comparison.planId) || site.plans[0];
  const { platforms } = comparison;
  const totalMonthly = platforms.reduce((sum, p) => sum + cents(p.monthly), 0);
  const totalYearly = totalMonthly * 12;
  const planCents = cents(plan.price);
  const planMonthly = Math.round(planCents / plan.months);
  const savings = totalYearly - planCents;

  return (
    <section ref={ref} id="comparacao" className={`cmp2 ${inView ? 'is-in' : ''}`} aria-labelledby="cmp-title">
      <div className="cmp2__bg" aria-hidden="true">
        <span className="cmp2__light cmp2__light--l" />
        <span className="cmp2__light cmp2__light--r" />
        <span className="cmp2__frames cmp2__frames--l">
          <i /> <i /> <i />
        </span>
        <span className="cmp2__frames cmp2__frames--r">
          <i /> <i /> <i />
        </span>
      </div>

      <div className="container cmp2__inner">
        <header className="cmp2__head">
          <span className="cmp2__eyebrow">
            <span className="cmp2__eyebrow-line" aria-hidden="true" />
            <Icon name="wallet" />
            Compare e economize
            <span className="cmp2__eyebrow-line" aria-hidden="true" />
          </span>
          <h2 id="cmp-title" className="cmp2__title">
            <span>Mais entretenimento,</span> <span>por um</span> <em>valor muito menor.</em>
          </h2>
          <p className="cmp2__lead">
            Veja quanto custaria assinar {platforms.length} plataformas separadamente e compare com o valor anual da{' '}
            <b>{site.brand.name}</b>.
          </p>
        </header>

        <div className="cmp2__grid">
          {/* Card esquerdo — plataformas individuais */}
          <article className="cmp2__list" aria-labelledby="cmp-list-title">
            <h3 id="cmp-list-title">{platforms.length} plataformas individuais</h3>
            <p className="cmp2__list-sub">Planos mensais ({comparison.screensLabel})</p>
            <ul className="cmp2__rows">
              {platforms.map((p, i) => (
                <li key={p.id} className="cmp2__row" style={{ '--i': i }}>
                  <span className="cmp2__name">{p.name}</span>
                  <span className="cmp2__price">{formatBRL(p.monthly)}/mês</span>
                </li>
              ))}
            </ul>
            <div className="cmp2__total">
              <span className="cmp2__total-label">
                Total das {platforms.length} assinaturas
              </span>
              <span className="cmp2__total-value">
                <strong>
                  {formatBRL(totalMonthly / 100)}
                  <small>/mês</small>
                </strong>
                <span>{formatBRL(totalYearly / 100)} por ano</span>
              </span>
            </div>
          </article>

          <div className="cmp2__vs" aria-hidden="true">
            <span>VS</span>
          </div>

          {/* Card direito — V PRIME PRO */}
          <article className="cmp2__brand" aria-labelledby="cmp-brand-title">
            <span className="cmp2__ribbon">
              <Icon name="star" /> Tudo em um
            </span>
            <div className="cmp2__brand-head">
              <img src={site.brand.symbol} alt="" width="220" height="199" loading="lazy" />
              <h3 id="cmp-brand-title">
                V PRIME <em>PRO</em>
              </h3>
            </div>
            <p className="cmp2__brand-text">Filmes, séries, esportes e canais ao vivo em um só plano anual.</p>

            <div className="cmp2__plan">
              <span className="cmp2__plan-tag">
                Plano anual <i aria-hidden="true">•</i> {plan.screens} telas
              </span>
              <strong className="cmp2__plan-price">
                <CountUp value={plan.price} duration={2000} />
                <small>/ano</small>
              </strong>
              <span className="cmp2__plan-month">
                <Icon name="calendar" /> Equivalente a {formatBRL(planMonthly / 100)} por mês
              </span>
            </div>

            <ul className="cmp2__perks">
              {perks.map((p) => (
                <li key={p.label}>
                  <Icon name={p.icon} />
                  {p.label}
                </li>
              ))}
            </ul>
            <a href="#planos" className="btn btn--primary btn--block cmp2__cta" onClick={onAnchor('planos')}>
              Quero economizar <Icon name="arrow" />
            </a>
          </article>
        </div>

        {/* Faixa de economia — calculada a partir da configuração */}
        {savings > 0 && (
          <div className="cmp2__save">
            <span className="cmp2__save-icon" aria-hidden="true">
              <Icon name="wallet" />
            </span>
            <span className="cmp2__save-label">Você economiza</span>
            <strong className="cmp2__save-value">
              <CountUp value={savings / 100} duration={2500} />
            </strong>
            <span className="cmp2__save-label">por ano</span>
          </div>
        )}

      </div>
    </section>
  );
}
