import { catalog } from '../../config/catalog.js';
import { site } from '../../config/site.js';
import ContentCarousel from './ContentCarousel.jsx';
import CategoryBar from './CategoryBar.jsx';
import './ContentSection.css';

/**
 * SEÇÃO 02 — Catálogo de conteúdos
 * Headline + dois carrosséis em sentidos opostos + faixa de categorias.
 * Tudo configurável em src/config/catalog.js
 */
export default function ContentSection() {
  const { layout, rows, categories, count, countConfirmed } = catalog;
  const showCount = countConfirmed || site.demoMode;

  const sizeVars = {
    '--pw-d': `${layout.posterWidth.desktop}px`,
    '--pw-t': `${layout.posterWidth.tablet}px`,
    '--pw-m': `${layout.posterWidth.mobile}px`,
    '--gap-d': `${layout.gap.desktop}px`,
    '--gap-t': `${layout.gap.tablet}px`,
    '--gap-m': `${layout.gap.mobile}px`,
  };

  return (
    <section id="conteudos" className="csection" style={sizeVars} aria-labelledby="csection-title">
      <div className="csection__bg" aria-hidden="true">
        <span className="csection__glow csection__glow--a" />
        <span className="csection__glow csection__glow--b" />
        <svg className="csection__wave" viewBox="0 0 1440 300" preserveAspectRatio="none">
          <defs>
            <linearGradient id="cs-w" x1="0" x2="1">
              <stop offset="0" stopColor="#d52bbd" stopOpacity="0" />
              <stop offset="0.5" stopColor="#d52bbd" stopOpacity="0.55" />
              <stop offset="1" stopColor="#7629d9" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M-50 220 C 300 120, 640 280, 980 180 S 1380 120, 1500 190" stroke="url(#cs-w)" strokeWidth="1.5" fill="none" />
        </svg>
      </div>

      <div className="container">
        <header className="csection__head reveal">
          <span className="eyebrow">Catálogo completo</span>
          <h2 id="csection-title" className="csection__title">
            {showCount ? (
              <>
                São mais de <span className="csection__count">{count}</span> conteúdos
              </>
            ) : (
              <>Um universo de conteúdos</>
            )}
            <br />
            dentro da <span className="csection__brand">V PRIME PRO</span>
          </h2>
          <p className="csection__sub">
            Filmes, séries, novelas, canais de TV e esportes. Do filme de sexta à noite à novela do fim da tarde, tem
            sempre alguma coisa esperando por você.
          </p>
        </header>
      </div>

      <div className="csection__rails reveal" style={{ '--d': '120ms' }}>
        {rows.map((row) => (
          <ContentCarousel key={row.id} items={row.items} direction={row.direction} speed={row.speed} label={row.label} />
        ))}
      </div>

      <div className="container">
        <CategoryBar categories={categories} />
      </div>
    </section>
  );
}
