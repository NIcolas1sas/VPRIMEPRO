import { useEffect, useRef, useState } from 'react';
import { formatBRL } from '../../config/site.js';

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

/**
 * Contagem progressiva de valores em reais (R$ 0,00 → valor).
 * - Dispara quando entra na tela, uma única vez por carregamento.
 * - O valor final fica "reservado" (invisível) por baixo, então a
 *   largura e o alinhamento não mudam durante a contagem.
 *
 * Uso: <CountUp value={247} duration={2000} />
 */
export default function CountUp({ value, duration = 2000, format = formatBRL }) {
  const ref = useRef(null);
  const [current, setCurrent] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    let raf = 0;
    const run = () => {
      if (done.current) return;
      done.current = true;
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration);
        setCurrent(t >= 1 ? value : value * easeOutCubic(t));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    if (!('IntersectionObserver' in window)) {
      run();
      return () => cancelAnimationFrame(raf);
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          io.disconnect();
          run();
        }
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className="countup" aria-label={format(value)}>
      <span className="countup__final" aria-hidden="true">
        {format(value)}
      </span>
      <span className="countup__value" aria-hidden="true">
        {format(Math.round(current * 100) / 100)}
      </span>
    </span>
  );
}
