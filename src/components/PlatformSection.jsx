import { useEffect, useRef, useState } from 'react';
import Icon from './ui/Icon.jsx';
import VslFrame from './ui/VslFrame.jsx';
import './PlatformSection.css';

const categories = [
  { icon: 'clapper', label: 'Filmes' },
  { icon: 'layers', label: 'Séries' },
  { icon: 'camera', label: 'Documentários' },
  { icon: 'tv', label: 'Novelas' },
];

/** Seção "Conheça a plataforma" — headline, moldura da VSL e categorias. */
export default function PlatformSection() {
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
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} id="plataforma" className={`platform ${inView ? 'is-in' : ''}`} aria-labelledby="platform-title">
      <div className="platform__bg" aria-hidden="true">
        <span className="platform__light platform__light--l" />
        <span className="platform__light platform__light--r" />
        <span className="platform__curve platform__curve--l" />
        <span className="platform__curve platform__curve--r" />
      </div>

      <div className="container platform__inner">
        <header className="platform__head">
          <span className="platform__eyebrow">
            <span className="platform__eyebrow-line" aria-hidden="true" />
            <span className="platform__eyebrow-icon" aria-hidden="true">
              <Icon name="play" />
            </span>
            Conheça a plataforma
            <span className="platform__eyebrow-line" aria-hidden="true" />
          </span>
          <h2 id="platform-title" className="platform__title">
            <span>Milhares de</span> <em>filmes e séries</em>
          </h2>
          <p className="platform__lead">
            Veja por dentro como filmes, séries, documentários e novelas ficam organizados por categoria, prontos para dar
            o play.
          </p>
        </header>

        {/* VSL: moldura pronta. O vídeo entra por VITE_VIDEO_PLATFORM ou VITE_VIDEO_PLATFORM_EMBED */}
        <div className="platform__vsl">
          <VslFrame slot="platform" badge="Visão geral da plataforma" />
        </div>

        <ul className="platform__cats">
          {categories.map((c, i) => (
            <li key={c.label} className="platform__cat" style={{ '--i': i }}>
              <Icon name={c.icon} />
              {c.label}
            </li>
          ))}
        </ul>

        <p className="platform__foot">
          <span className="platform__foot-line" aria-hidden="true" />
          <span className="platform__foot-icon" aria-hidden="true">
            <Icon name="play" />
          </span>
          Assista ao vídeo e veja a <b>V PRIME PRO</b> funcionando antes de assinar.
          <span className="platform__foot-line" aria-hidden="true" />
        </p>
      </div>
    </section>
  );
}
