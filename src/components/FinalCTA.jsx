import { useEffect, useRef, useState } from 'react';
import Icon from './ui/Icon.jsx';
import { onAnchor } from '../lib/scroll.js';
import { site } from '../config/site.js';
import './FinalCTA.css';

/** Fundo da área de CTA (troque o arquivo mantendo o nome). */
const FINAL_BG = '/images/final-cta-bg.webp';

const perks = [
  { icon: 'monitor', label: ['Filmes e', 'Séries'] },
  { icon: 'ball', label: ['Esportes', 'ao vivo'] },
  { icon: 'tv', label: ['Canais', 'variados'] },
  { icon: 'diamond', label: ['Alta', 'qualidade'] },
];

export default function FinalCTA() {
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
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className={`fcta ${inView ? 'is-in' : ''}`}
      aria-labelledby="final-title"
      style={{ '--fcta-bg': `url(${FINAL_BG})` }}
    >
      <div className="fcta__bg" aria-hidden="true">
        <span className="fcta__photo" />
        <span className="fcta__shade" />
      </div>

      <div className="container fcta__inner">
        <div className="fcta__brand">
          <img src={site.brand.symbol} alt="" width="220" height="199" loading="lazy" />
          <span>
            V PRIME <b>PRO</b>
          </span>
        </div>

        <h2 id="final-title" className="fcta__title">
          <span>Seu próximo momento de</span> <em>diversão</em> <span>começa aqui.</span>
        </h2>
        <p className="fcta__lead">
          Escolha seu plano, receba o acesso no seu e-mail e comece a assistir. Se não gostar, você tem 7 dias para pedir o reembolso.
        </p>

        <a href="#planos" className="fcta__btn" onClick={onAnchor('planos')}>
          <Icon name="play" className="fcta__btn-play" />
          Escolher meu plano
          <Icon name="arrow" />
        </a>

        <ul className="fcta__perks">
          {perks.map((p, i) => (
            <li key={p.icon} style={{ '--i': i }}>
              <Icon name={p.icon} />
              <span>
                {p.label[0]}
                <br />
                {p.label[1]}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
