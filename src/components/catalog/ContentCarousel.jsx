import { useEffect, useRef, useState } from 'react';
import ContentPoster from './ContentPoster.jsx';

/**
 * Carrossel horizontal automático com loop infinito.
 * A sequência é renderizada duas vezes; a faixa anda exatamente
 * metade da largura (uma sequência) e recomeça sem salto.
 *
 * props: items, direction ('left' | 'right'), speed (px/s), label
 */
export default function ContentCarousel({ items, direction = 'left', speed = 32, label }) {
  const trackRef = useRef(null);
  const [duration, setDuration] = useState(60);
  const [touching, setTouching] = useState(false);

  // Duração calculada pela largura real → mesma velocidade em qualquer tela
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;
    const update = () => {
      const half = track.scrollWidth / 2;
      if (half > 0) setDuration(half / Math.max(speed, 1));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(track);
    return () => ro.disconnect();
  }, [speed, items.length]);

  return (
    <div
      className={`ccarousel ccarousel--${direction} ${touching ? 'is-paused' : ''}`}
      role="region"
      aria-roledescription="carrossel"
      aria-label={label}
      onTouchStart={() => setTouching(true)}
      onTouchEnd={() => setTouching(false)}
      onTouchCancel={() => setTouching(false)}
    >
      <ul ref={trackRef} className="ccarousel__track" style={{ '--duration': `${duration}s` }}>
        {items.map((item, i) => (
          <ContentPoster key={`a-${i}`} item={item} />
        ))}
        {items.map((item, i) => (
          <ContentPoster key={`b-${i}`} item={item} hidden />
        ))}
      </ul>
    </div>
  );
}
