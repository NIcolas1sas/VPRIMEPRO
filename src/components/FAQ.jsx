import { useEffect, useRef, useState } from 'react';
import Icon from './ui/Icon.jsx';
import { faq } from '../config/faq.js';
import './FAQ.css';

/** Ilustração dos balões de dúvida (coluna esquerda). */
function BubblesArt() {
  return (
    <svg className="faq__art" viewBox="0 0 240 200" aria-hidden="true">
      <defs>
        <linearGradient id="fq-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#9b4dff" />
          <stop offset="1" stopColor="#5421a8" />
        </linearGradient>
        <linearGradient id="fq-b" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff5fcf" />
          <stop offset="1" stopColor="#c0249f" />
        </linearGradient>
        <filter id="fq-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* balão rosa (atrás) */}
      <g className="faq__bubble faq__bubble--b" filter="url(#fq-glow)">
        <path d="M118 70h82a24 24 0 0 1 24 24v44a24 24 0 0 1-24 24h-6l10 22-30-22h-56a24 24 0 0 1-24-24V94a24 24 0 0 1 24-24z" fill="url(#fq-b)" />
        <circle cx="140" cy="118" r="7" fill="#fff" opacity=".9" />
        <circle cx="162" cy="118" r="7" fill="#fff" opacity=".9" />
        <circle cx="184" cy="118" r="7" fill="#fff" opacity=".9" />
      </g>
      {/* balão roxo (frente) */}
      <g className="faq__bubble faq__bubble--a" filter="url(#fq-glow)">
        <path d="M40 16h96a28 28 0 0 1 28 28v52a28 28 0 0 1-28 28H74l-34 26 8-26h-8a28 28 0 0 1-28-28V44a28 28 0 0 1 28-28z" fill="url(#fq-a)" />
        <text x="88" y="98" textAnchor="middle" fontSize="78" fontWeight="800" fill="#f3e8ff" fontFamily="Manrope, Arial, sans-serif">
          ?
        </text>
      </g>
    </svg>
  );
}

export default function FAQ() {
  const [open, setOpen] = useState(0); // primeira resposta aberta por padrão
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

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

  return (
    <section ref={ref} id="duvidas" className={`faq2 ${inView ? 'is-in' : ''}`} aria-labelledby="faq-title">
      <div className="faq2__bg" aria-hidden="true">
        <span className="faq2__arc faq2__arc--top" />
        <span className="faq2__arc faq2__arc--bottom" />
        <span className="faq2__light" />
      </div>

      <div className="container faq2__inner">
        <aside className="faq2__intro">
          <BubblesArt />
          <span className="faq2__eyebrow">
            <span className="faq2__eyebrow-line" aria-hidden="true" />
            Dúvidas frequentes
            <span className="faq2__eyebrow-line" aria-hidden="true" />
          </span>
          <h2 id="faq-title" className="faq2__title">
            <span>Perguntas</span> <em>frequentes</em>
          </h2>
          <p className="faq2__lead">
            Respostas diretas sobre pagamento, instalação, aparelhos e garantia. Se ainda sobrar alguma dúvida, nosso suporte
            responde no WhatsApp.
          </p>
        </aside>

        <div className="faq2__list">
          {faq.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} className={`faq2__item ${isOpen ? 'is-open' : ''}`} style={{ '--i': i }}>
                <h3 className="faq2__q">
                  <button
                    type="button"
                    id={`faq-btn-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                  >
                    <span className="faq2__icon" aria-hidden="true">
                      <Icon name={item.icon} />
                    </span>
                    <span className="faq2__num" aria-hidden="true">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="faq2__text">{item.q}</span>
                    <span className="faq2__toggle" aria-hidden="true">
                      <Icon name="chevron" />
                    </span>
                  </button>
                </h3>
                <div id={`faq-panel-${i}`} role="region" aria-labelledby={`faq-btn-${i}`} className="faq2__panel">
                  <div className="faq2__panel-inner">
                    <p>{item.a}</p>
                    {item.list && (
                      <ul>
                        {item.list.map((li) => (
                          <li key={li}>{li}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
