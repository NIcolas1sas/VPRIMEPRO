import { useCallback, useEffect, useRef, useState } from 'react';
import Icon from './ui/Icon.jsx';
import { site } from '../config/site.js';
import { onAnchor } from '../lib/scroll.js';
import './Testimonials.css';

const AUTOPLAY_MS = 3200;
const SLOTS = 3; // cards renderizados de cada lado do centro (o 3º fica invisível)
const mod = (a, n) => ((a % n) + n) % n;

/**
 * Seção de depoimentos — carrossel 9:16 com destaque no centro.
 * Imagens em site.testimonials. Item sem `image` vira moldura vazia.
 * Loop infinito: cada card é identificado por um índice absoluto,
 * então a fila nunca "acaba" e não há espaços vazios.
 */
export default function Testimonials() {
  const items = site.testimonials.length ? site.testimonials : Array.from({ length: 5 }, () => ({}));
  const n = items.length;
  const [pos, setPos] = useState(0); // índice absoluto do card central
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [inView, setInView] = useState(false);
  const ref = useRef(null);
  const drag = useRef(null);

  const next = useCallback(() => setPos((p) => p + 1), []);
  const prev = useCallback(() => setPos((p) => p - 1), []);

  // Entrada (uma vez) + só anda quando a seção está na tela
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) {
      setInView(true);
      setVisible(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        setVisible(e.isIntersecting);
        if (e.isIntersecting) setInView(true);
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (paused || !visible || n < 2) return undefined;
    const t = setTimeout(next, AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [pos, paused, visible, n, next]);

  const onPointerDown = (e) => {
    drag.current = { x: e.clientX };
  };
  const onPointerUp = (e) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    drag.current = null;
    if (Math.abs(dx) > 40) (dx < 0 ? next : prev)();
  };

  const slots = [];
  for (let o = -SLOTS; o <= SLOTS; o += 1) slots.push(pos + o);
  const current = mod(pos, n);

  return (
    <section ref={ref} id="depoimentos" className={`testi ${inView ? 'is-in' : ''}`} aria-labelledby="testi-title">
      <div className="testi__bg" aria-hidden="true">
        <span className="testi__light testi__light--l" />
        <span className="testi__light testi__light--r" />
        <span className="testi__streak testi__streak--l" />
        <span className="testi__streak testi__streak--r" />
      </div>

      <div className="container testi__inner">
        <header className="testi__head">
          <span className="testi__eyebrow">
            <span className="testi__eyebrow-line" aria-hidden="true" />
            <Icon name="chat" />
            Depoimentos reais
            <span className="testi__eyebrow-line" aria-hidden="true" />
          </span>
          <h2 id="testi-title" className="testi__title">
            <span>Quem já assina</span> <span>conta como está sendo com a</span> <em>V PRIME PRO.</em>
          </h2>
          <p className="testi__lead">Conversas de clientes com o nosso WhatsApp sobre a instalação, o atendimento e o que estão assistindo.</p>
        </header>
      </div>

      <div
        className="testi__carousel"
        role="region"
        aria-roledescription="carrossel"
        aria-label="Depoimentos de clientes"
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
        <ul className="testi__stage">
          {slots.map((k) => {
            const o = k - pos;
            const item = items[mod(k, n)];
            const abs = Math.abs(o);
            return (
              <li
                key={k}
                className={`testi__card ${o === 0 ? 'is-active' : ''}`}
                style={{ '--o': o, '--abs': abs, zIndex: 10 - abs }}
                data-edge={abs >= SLOTS ? '' : undefined}
                aria-hidden={o !== 0}
              >
                <div className="testi__frame">
                  {item.image && (
                    <img src={item.image} alt={o === 0 ? item.alt || 'Depoimento de cliente' : ''} loading="lazy" decoding="async" draggable="false" />
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {n > 1 && (
        <div className="testi__dots" role="tablist" aria-label="Escolher depoimento">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === current}
              aria-label={`Depoimento ${i + 1}`}
              className={`testi__dot ${i === current ? 'is-active' : ''}`}
              onClick={() => setPos((p) => p + (i - mod(p, n)))}
            />
          ))}
        </div>
      )}

      <div className="container testi__cta-wrap">
        <span className="testi__cta-line" aria-hidden="true" />
        <a href="#planos" className="testi__cta" onClick={onAnchor('planos')}>
          Escolha seu plano agora <Icon name="arrow" />
        </a>
        <span className="testi__cta-line" aria-hidden="true" />
      </div>
    </section>
  );
}
