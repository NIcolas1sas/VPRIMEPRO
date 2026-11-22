import { useCallback, useEffect, useRef, useState } from 'react';
import Poster from './ui/Poster.jsx';
import VideoSlot from './ui/VideoSlot.jsx';
import { categories } from '../config/categories.js';
import './ContentVariety.css';

const AUTOPLAY_MS = 3800;

/** Distância circular entre o card i e o ativo (ex.: -2, -1, 0, 1, 2). */
function offsetOf(i, active, n) {
  let d = (i - active) % n;
  if (d > n / 2) d -= n;
  if (d < -n / 2) d += n;
  return d;
}

/**
 * Seção 4 — carrossel em destaque (coverflow).
 * Card central grande, vizinhos menores dos lados. Avança sozinho,
 * pausa no hover, aceita clique, setas, arrastar (celular) e teclado.
 */
function Coverflow({ items }) {
  const n = items.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const rootRef = useRef(null);
  const drag = useRef(null);

  const go = useCallback((i) => setActive(((i % n) + n) % n), [n]);
  const next = useCallback(() => setActive((a) => (a + 1) % n), [n]);
  const prev = useCallback(() => setActive((a) => (a - 1 + n) % n), [n]);

  // Só anda quando a seção está visível
  useEffect(() => {
    const el = rootRef.current;
    if (!el || !('IntersectionObserver' in window)) {
      setInView(true);
      return undefined;
    }
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (paused || !inView) return undefined;
    const t = setTimeout(next, AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [active, paused, inView, next]);

  const onPointerDown = (e) => {
    drag.current = { x: e.clientX, moved: false };
  };
  const onPointerUp = (e) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    if (Math.abs(dx) > 40) {
      drag.current.moved = true;
      if (dx < 0) next();
      else prev();
    }
    setTimeout(() => (drag.current = null), 0);
  };

  return (
    <div
      ref={rootRef}
      className="cflow"
      role="region"
      aria-roledescription="carrossel"
      aria-label="Categorias de conteúdo"
      tabIndex={0}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={() => (drag.current = null)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') next();
        if (e.key === 'ArrowLeft') prev();
      }}
    >
      <ul className="cflow__stage">
        {items.map((it, i) => {
          const d = offsetOf(i, active, n);
          const abs = Math.abs(d);
          return (
            <li
              key={it.g}
              className={`cflow__card ${d === 0 ? 'is-active' : ''}`}
              style={{ '--d': d, '--abs': abs, zIndex: 10 - abs }}
              data-hidden={abs > 2 ? '' : undefined}
              data-far={abs === 2 ? '' : undefined}
              aria-hidden={d !== 0}
              onClick={() => {
                if (drag.current?.moved) return;
                if (d !== 0) go(i);
              }}
            >
              <div className="cflow__media">
                {it.image ? (
                  <img
                    src={it.image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    draggable="false"
                    style={{ objectPosition: it.imagePosition || '50% 50%' }}
                  />
                ) : (
                  <Poster genre={it.g} ratio="fill" />
                )}
              </div>
              <div className="cflow__txt">
                <span className="cflow__num">{String(i + 1).padStart(2, '0')}</span>
                <h3>{it.label}</h3>
                <p>{it.t}</p>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="cflow__controls">
        <button type="button" className="cflow__arrow" onClick={prev} aria-label="Categoria anterior">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
        </button>
        <div className="cflow__dots" role="tablist" aria-label="Escolher categoria">
          {items.map((it, i) => (
            <button
              key={it.g}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={it.label}
              className={`cflow__dot ${i === active ? 'is-active' : ''}`}
              onClick={() => go(i)}
            >
              {i === active && !paused && inView && (
                <span key={active} className="cflow__progress" style={{ animationDuration: `${AUTOPLAY_MS}ms` }} />
              )}
            </button>
          ))}
        </div>
        <button type="button" className="cflow__arrow" onClick={next} aria-label="Próxima categoria">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
      <p className="sr-only" aria-live="polite">
        {items[active].label}
      </p>
    </div>
  );
}

export default function ContentVariety() {
  return (
    <section id="catalogo" className="section variety" aria-labelledby="variety-title">
      <div className="container">
        <header className="section-head reveal">
          <span className="eyebrow">Variedade</span>
          <h2 id="variety-title">
            Sempre existe algo <span className="grad-text">novo</span> para assistir.
          </h2>
          <p>Dez categorias para cada momento, da maratona de fim de semana ao filme rápido antes de dormir.</p>
        </header>
      </div>

      <div className="reveal reveal--zoom">
        <Coverflow items={categories} />
      </div>

      <div className="container">
        {/* VÍDEO 3 — Catálogo de filmes e séries (renderiza apenas quando configurado) */}
        <VideoSlot slot="catalog" />
      </div>
    </section>
  );
}
