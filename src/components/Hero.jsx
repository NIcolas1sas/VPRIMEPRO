import { onAnchor } from '../lib/scroll.js';
import Icon from './ui/Icon.jsx';
import VideoPlayer from './ui/VideoPlayer.jsx';
import './Hero.css';

const indicators = [
  { icon: 'layers', label: '+80 mil conteúdos' },
  { icon: 'devices', label: 'TV, celular, TV Box e PC' },
  { icon: 'calendar', label: 'Sem mensalidade' },
  { icon: 'headset', label: 'Suporte no WhatsApp' },
];

/* Pontos de luz quase imperceptíveis (posições fixas, sem custo de JS) */
const sparks = [
  [8, 22, 0], [16, 68, 2.1], [27, 38, 4.2], [34, 84, 1.3], [44, 16, 3.4], [52, 58, 0.7],
  [61, 30, 2.8], [68, 78, 4.9], [76, 12, 1.8], [83, 48, 3.9], [91, 70, 0.4], [96, 26, 2.5],
];

function HeroBackground() {
  return (
    <div className="hero__bg" aria-hidden="true">
      <span className="hero__aurora hero__aurora--violet" />
      <span className="hero__aurora hero__aurora--magenta" />
      <span className="hero__aurora hero__aurora--pink" />

      <svg className="hero__waves" viewBox="0 0 1440 400" preserveAspectRatio="none">
        <defs>
          <linearGradient id="hw-a" x1="0" x2="1">
            <stop offset="0" stopColor="#7629d9" stopOpacity="0" />
            <stop offset="0.35" stopColor="#7629d9" stopOpacity="0.9" />
            <stop offset="0.7" stopColor="#f05bcb" stopOpacity="0.9" />
            <stop offset="1" stopColor="#f05bcb" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="hw-b" x1="0" x2="1">
            <stop offset="0" stopColor="#d52bbd" stopOpacity="0" />
            <stop offset="0.5" stopColor="#d52bbd" stopOpacity="0.7" />
            <stop offset="1" stopColor="#5421a8" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g className="hero__wave hero__wave--1">
          <path d="M-200 300 C 200 180, 520 360, 860 250 S 1440 170, 1700 260" stroke="url(#hw-a)" strokeWidth="2" fill="none" />
          <path d="M-200 318 C 220 200, 540 380, 880 270 S 1460 190, 1700 280" stroke="url(#hw-a)" strokeWidth="1" fill="none" opacity=".5" />
        </g>
        <g className="hero__wave hero__wave--2">
          <path d="M-200 340 C 160 260, 600 400, 960 300 S 1480 250, 1700 330" stroke="url(#hw-b)" strokeWidth="1.5" fill="none" />
        </g>
      </svg>

      <div className="hero__sparks">
        {sparks.map(([x, y, d], i) => (
          <span key={i} style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${d}s` }} />
        ))}
      </div>
      <span className="hero__vignette" />
    </div>
  );
}

export default function Hero() {
  return (
    <section id="inicio" className="hero" aria-labelledby="hero-title">
      <HeroBackground />

      <div className="container hero__inner">
        <div className="hero__copy">
          <span className="hero__badge reveal">
            <span className="hero__dot" /> Filmes, séries e TV ao vivo
          </span>

          <h1 id="hero-title" className="hero__title reveal" style={{ '--d': '80ms' }}>
            Tudo para <span className="grad-text">assistir</span> em <span className="grad-text">um só lugar.</span>
          </h1>

          <p className="hero__lead reveal" style={{ '--d': '160ms' }}>
            Mais de 60 mil filmes, séries e novelas, além de 500 canais ao vivo e esportes. Na Smart TV, no celular, na
            TV Box ou no computador.
          </p>
          <p className="hero__sub reveal" style={{ '--d': '220ms' }}>
            Um pagamento por ano, sem mensalidade e sem fidelidade. E você ainda tem 7 dias de garantia para testar.
          </p>

          <div className="hero__ctas reveal" style={{ '--d': '300ms' }}>
            <a href="#planos" className="btn btn--primary" onClick={onAnchor('planos')}>
              Quero meu acesso <Icon name="arrow" />
            </a>
            <a href="#planos" className="btn btn--ghost" onClick={onAnchor('planos')}>
              Comparar planos
            </a>
          </div>

          <ul className="hero__indicators reveal" style={{ '--d': '380ms' }}>
            {indicators.map((it) => (
              <li key={it.label}>
                <Icon name={it.icon} />
                {it.label}
              </li>
            ))}
          </ul>
        </div>

        {/* VÍDEO 1 — Apresentação comercial (configurável em site.videos.presentation) */}
        <div className="hero__visual">
          <VideoPlayer slot="presentation" className="hero__player" priority />
        </div>
      </div>
    </section>
  );
}
