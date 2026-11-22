import { useEffect, useRef, useState } from 'react';
import Icon from './ui/Icon.jsx';
import { MailCheckIcon, WhatsAppIcon } from './ui/BrandIcons.jsx';
import { site, formatBRL } from '../config/site.js';
import useActions from '../lib/useActions.js';
import { markOfferSeen, trackInitiateCheckout } from '../lib/tracking.js';
import './Pricing.css';

/** Fundo cinematográfico da seção (troque o arquivo mantendo o nome). */
const PLANS_BG = '/images/plans-bg.webp';
const planIcon = (screens) => (screens >= 3 ? 'diamond' : screens === 2 ? 'users' : 'user');

const screensLabel = (n) => `${n} ${n === 1 ? 'tela simultânea' : 'telas simultâneas'}`;

function Price({ value }) {
  const [int, cents] = formatBRL(value).replace('R$', '').trim().split(',');
  return (
    <span className="plan__price">
      <span className="plan__cur">R$</span>
      <span className="plan__int">{int}</span>
      <span className="plan__cents">,{cents}</span>
    </span>
  );
}

export default function Pricing() {
  const { checkout } = useActions();
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  // Entrada disparada uma única vez
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
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Meta: ViewContent quando a oferta aparece (o envio respeita o consentimento)
  useEffect(() => {
    if (inView) markOfferSeen();
  }, [inView]);

  return (
    <section
      ref={ref}
      id="planos"
      className={`section pricing ${inView ? 'is-in' : ''}`}
      aria-labelledby="pricing-title"
      style={{ '--plans-bg': `url(${PLANS_BG})` }}
    >
      <div className="pricing__bg" aria-hidden="true">
        <span className="pricing__photo" />
        <span className="pricing__shade" />
        <span className="pricing__glow" />
      </div>
      <div className="container">
        <header className="section-head pricing__head">
          <span className="pricing__eyebrow">
            <span className="pricing__eyebrow-line" aria-hidden="true" />
            Planos {site.brand.name}
            <span className="pricing__eyebrow-line" aria-hidden="true" />
          </span>
          <h2 id="pricing-title" className="pricing__title">
            <span>Um pagamento,</span> <em>12 meses de diversão.</em>
          </h2>
          <p>Sem mensalidade e sem fidelidade. Escolha quantas telas você precisa e teste por 7 dias com garantia.</p>
        </header>

        {site.stats?.length > 0 && (
          <ul className="pricing__stats" aria-label="Números do catálogo" style={{ '--n': site.stats.length }}>
            {site.stats.map((st, i) => (
              <li key={st.label} className="pricing__stat" style={{ '--i': i }}>
                <span className="pricing__stat-icon" aria-hidden="true">
                  <Icon name={st.icon} />
                </span>
                <span>
                  <strong>{st.value}</strong>
                  <small>{st.label}</small>
                </span>
              </li>
            ))}
          </ul>
        )}

        <div className="pricing__grid">
          {site.plans.map((plan, i) => (
            <article
              key={plan.id}
              className={`plan ${plan.featured ? 'plan--featured' : ''}`}
              style={{ '--i': i }}
              aria-labelledby={`plan-${plan.id}`}
            >
              {plan.badge && <span className="plan__badge">{plan.badge}</span>}
              <div className="plan__head">
                <span className="plan__icon" aria-hidden="true">
                  <Icon name={planIcon(plan.screens)} />
                </span>
                <h3 id={`plan-${plan.id}`}>
                  <small>Plano</small> {plan.name}
                </h3>
                <p>{plan.description}</p>
              </div>

              <div className="plan__pricebox">
                <Price value={plan.price} />
                <span className="plan__period">
                  por {plan.months} meses de acesso · equivale a {formatBRL(plan.price / plan.months)}/mês
                </span>
              </div>

              <div className="plan__keys">
                <span>
                  <Icon name="calendar" /> {plan.months} meses
                </span>
                <span>
                  <Icon name="devices" /> {screensLabel(plan.screens)}
                </span>
              </div>

              <ul className="plan__features">
                {site.planFeatures.map((f) => (
                  <li key={f}>
                    <Icon name="check" /> {f.replace('{telas}', `${plan.screens} ${plan.screens === 1 ? 'Tela' : 'Telas'}`)}
                  </li>
                ))}
              </ul>

              {plan.checkoutUrl ? (
                // Link real: abre o checkout da Braip em nova aba (funciona também no celular)
                <a
                  href={plan.checkoutUrl}
                  target="_blank"
                  rel="noopener"
                  onClick={() => trackInitiateCheckout(plan)}
                  className={`btn btn--block ${plan.featured ? 'btn--primary' : 'btn--ghost'}`}
                  aria-label={`Quero o plano ${plan.name} por ${formatBRL(plan.price)} (abre o checkout em nova aba)`}
                >
                  Garantir meu plano <Icon name="arrow" />
                </a>
              ) : (
                <button
                  type="button"
                  className={`btn btn--block ${plan.featured ? 'btn--primary' : 'btn--ghost'}`}
                  onClick={() => checkout(plan)}
                  aria-label={`Quero o plano ${plan.name} por ${formatBRL(plan.price)}`}
                >
                  Garantir meu plano <Icon name="arrow" />
                </button>
              )}
            </article>
          ))}
        </div>

        {/* Card de instalação e suporte */}
        <div className="pricing__help">
          <div className="pricing__help-item">
            <span className="pricing__help-icon">
              <MailCheckIcon />
            </span>
            <div>
              <h3>
                Receba tudo <em>no seu e-mail!</em>
              </h3>
              <p>
                Assim que o pagamento é confirmado, chegam no seu e-mail os dados de acesso e o passo a passo para instalar
                no seu aparelho.
              </p>
            </div>
          </div>
          <span className="pricing__help-divider" aria-hidden="true" />
          <div className="pricing__help-item">
            <span className="pricing__help-icon pricing__help-icon--wa">
              <WhatsAppIcon />
            </span>
            <div>
              <h3>
                Precisou de <em>ajuda?</em>
              </h3>
              <p>
                Nosso suporte no WhatsApp ajuda você a instalar, com atendimento individual e, se precisar, por
                videochamada.
              </p>
            </div>
          </div>
        </div>

        <div className="pricing__table-wrap">
          <table className="pricing__table">
            <caption className="sr-only">Comparação entre os planos</caption>
            <thead>
              <tr>
                <th scope="col">Comparativo</th>
                {site.plans.map((p) => (
                  <th key={p.id} scope="col" className={p.featured ? 'is-featured' : ''}>
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Valor</th>
                {site.plans.map((p) => (
                  <td key={p.id} className={p.featured ? 'is-featured' : ''}>
                    {formatBRL(p.price)}
                  </td>
                ))}
              </tr>
              <tr>
                <th scope="row">Período de acesso</th>
                {site.plans.map((p) => (
                  <td key={p.id} className={p.featured ? 'is-featured' : ''}>
                    {p.months} meses
                  </td>
                ))}
              </tr>
              <tr>
                <th scope="row">Telas simultâneas</th>
                {site.plans.map((p) => (
                  <td key={p.id} className={p.featured ? 'is-featured' : ''}>
                    {p.screens}
                  </td>
                ))}
              </tr>
              <tr>
                <th scope="row">Equivalente mensal</th>
                {site.plans.map((p) => (
                  <td key={p.id} className={p.featured ? 'is-featured' : ''}>
                    {formatBRL(p.price / p.months)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        <p className="note pricing__note">
          Formas de pagamento e condições finais são apresentadas na página de pagamento no momento da contratação.
        </p>
      </div>
    </section>
  );
}
