import { features, featureConfirmations } from '../../config/features.js';
import { site } from '../../config/site.js';
import FeatureCard from './FeatureCard.jsx';
import './FeatureSection.css';

/**
 * SEÇÃO 03 — "Tudo o que você encontra na V PRIME PRO"
 * Seis cards configurados em src/config/features.js
 */
export default function FeatureSection() {
  const cards = features
    .map((f) => {
      const confirmed = !f.confirmKey || featureConfirmations[f.confirmKey];
      if (confirmed) return { feature: f, pending: false };
      if (site.demoMode) return { feature: f, pending: true };
      if (f.fallback) return { feature: { ...f, ...f.fallback }, pending: false };
      return null;
    })
    .filter(Boolean);

  return (
    <section id="destaques" className="fsection" aria-labelledby="fsection-title">
      <div className="fsection__bg" aria-hidden="true">
        <span className="fsection__beam fsection__beam--l" />
        <span className="fsection__beam fsection__beam--r" />
        <span className="fsection__glow" />
      </div>

      <div className="container">
        <header className="fsection__head reveal">
          <span className="eyebrow">O que está incluso</span>
          <h2 id="fsection-title" className="fsection__title">
            Tudo o que você encontra na
            <span className="fsection__brand">
              <span className="grad-text">V PRIME PRO</span>
            </span>
          </h2>
          <p className="fsection__sub">Seis motivos para trocar várias assinaturas por uma só.</p>
        </header>

        <div className="fsection__grid">
          {cards.map(({ feature, pending }, i) => (
            <FeatureCard key={feature.id} feature={feature} pending={pending} delay={(i % 3) * 90} />
          ))}
        </div>
      </div>
    </section>
  );
}
