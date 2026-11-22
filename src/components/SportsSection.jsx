import { useEffect, useRef, useState } from 'react';
import Icon from './ui/Icon.jsx';
import VideoPlayer from './ui/VideoPlayer.jsx';
import './SportsSection.css';

/** Imagem de fundo da seção (estádio). Troque o arquivo mantendo o nome. */
const STADIUM_BG = '/images/sports-stadium-bg.webp';

const cards = [
  { icon: 'ball', title: 'Jogos ao vivo', text: 'Em alta definição' },
  { icon: 'calendar', title: 'Guia de programação', text: 'Saiba a hora de cada jogo' },
  { icon: 'live', title: 'Canais esportivos', text: 'Nacionais e internacionais' },
  { icon: 'layers', title: 'Diversas modalidades', text: 'Futebol, vôlei, basquete e muito mais' },
];

// Pontos de luz do fundo: [x%, y%, tamanho px, atraso s]
const SPARKS = [
  [6, 18, 3, 0], [14, 42, 2, 1.4], [22, 12, 2, 2.6], [31, 30, 3, 0.8], [47, 8, 2, 3.2],
  [58, 22, 3, 1.9], [66, 10, 2, 0.4], [74, 36, 2, 2.2], [83, 16, 3, 1.1], [92, 40, 2, 3.6],
];

export default function SportsSection() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  // Dispara a entrada uma única vez, quando a seção aparece
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
      { threshold: 0.18 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id="esportes"
      className={`sports ${inView ? 'is-in' : ''}`}
      aria-labelledby="sports-title"
      style={{ '--sports-bg': `url(${STADIUM_BG})` }}
    >
      {/* Fundo: estádio + camadas de cor/contraste */}
      <div className="sports__bg" aria-hidden="true">
        <span className="sports__photo" />
        <span className="sports__tint" />
        <span className="sports__shade" />
        <span className="sports__neon" />
        {SPARKS.map((s, i) => (
          <span
            key={i}
            className="sports__spark"
            style={{ left: `${s[0]}%`, top: `${s[1]}%`, '--s': `${s[2]}px`, animationDelay: `${s[3]}s` }}
          />
        ))}
      </div>

      {/* Transição suave a partir da seção anterior */}
      <div className="sports__transition" aria-hidden="true">
        <svg className="sports__wave" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <defs>
            <linearGradient id="sw-line" x1="0" x2="1">
              <stop offset="0" stopColor="#7629d9" stopOpacity="0" />
              <stop offset="0.35" stopColor="#9b4dff" />
              <stop offset="0.65" stopColor="#f05bcb" />
              <stop offset="1" stopColor="#f05bcb" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path className="sports__wave-line" d="M0 70 C 240 30, 480 110, 720 70 S 1200 30, 1440 70" stroke="url(#sw-line)" strokeWidth="2" fill="none" />
          <path className="sports__wave-line sports__wave-line--2" d="M0 86 C 260 50, 520 120, 760 84 S 1220 50, 1440 88" stroke="url(#sw-line)" strokeWidth="1" fill="none" />
        </svg>
      </div>

      <div className="container sports__inner">
        <div className="sports__copy">
          <span className="sports__eyebrow">
            <span className="sports__eyebrow-line" aria-hidden="true" />
            <Icon name="trophy" />
            Esportes
            <span className="sports__eyebrow-line" aria-hidden="true" />
          </span>

          <h2 id="sports-title" className="sports__title">
            <span className="sports__title-line">
              O melhor do <em>esporte,</em>
            </span>
            <span className="sports__title-line">
              ao seu <em>alcance.</em>
            </span>
          </h2>
          <span className="sports__stroke" aria-hidden="true" />

          <p className="sports__lead">
            Campeonatos nacionais e internacionais ao vivo, no mesmo acesso em que você assiste filmes e novelas. Um
            plano só para o jogo de domingo e o filme da semana.
          </p>

          <ul className="sports__cards">
            {cards.map((c, i) => (
              <li key={c.title} className="sports__card" style={{ '--i': i }}>
                <span className="sports__card-icon" aria-hidden="true">
                  <Icon name={c.icon} />
                </span>
                <span>
                  <b>{c.title}</b>
                  <small>{c.text}</small>
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* VSL de esportes — estrutura pronta; o vídeo entra por VITE_VIDEO_SPORTS */}
        <div className="sports__vsl">
          <VideoPlayer slot="sports" />
        </div>
      </div>
    </section>
  );
}
