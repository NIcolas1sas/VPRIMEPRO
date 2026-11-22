import Poster from './Poster.jsx';
import Icon from './Icon.jsx';
import { site } from '../../config/site.js';
import './Devices.css';

/**
 * Mockups de dispositivos com uma interface ILUSTRATIVA da V PRIME PRO.
 * Todas as medidas internas usam "em" e escalam com a largura da tela
 * (container queries), então funcionam em qualquer tamanho.
 */

const row = ['action', 'scifi', 'drama', 'thriller', 'comedy', 'animation'];

function Brand() {
  return (
    <span className="ui-brand">
      <img src={site.brand.logo} alt="" width="16" height="16" loading="lazy" />
      <b>V PRIME</b>
    </span>
  );
}

export function StreamScreen({ variant = 'tv' }) {
  if (variant === 'phone') {
    return (
      <div className="ui ui--phone">
        <div className="ui-top">
          <Brand />
          <Icon name="search" className="ui-ico" />
        </div>
        <div className="ui-hero ui-hero--phone">
          <Poster genre="scifi" ratio="fill" />
          <div className="ui-hero__txt">
            <span className="ui-chip">Destaque</span>
            <b>Órbita Zero</b>
            <span className="ui-btn">
              <Icon name="play" /> Assistir
            </span>
          </div>
        </div>
        <span className="ui-row-title">Para você</span>
        <div className="ui-grid">
          {['action', 'drama', 'comedy', 'sports'].map((g) => (
            <Poster key={g} genre={g} />
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'tablet') {
    return (
      <div className="ui ui--tablet">
        <div className="ui-top">
          <Brand />
          <span className="ui-tabs">
            <i className="on">Início</i>
            <i>Filmes</i>
            <i>Séries</i>
            <i>Esportes</i>
          </span>
        </div>
        <div className="ui-hero ui-hero--tablet">
          <Poster genre="action" ratio="fill" />
          <div className="ui-hero__txt">
            <span className="ui-chip">Em alta</span>
            <b>Linha de Fogo</b>
            <span className="ui-btn">
              <Icon name="play" /> Assistir
            </span>
          </div>
        </div>
        <span className="ui-row-title">Continue assistindo</span>
        <div className="ui-row">
          {row.slice(1, 5).map((g) => (
            <Poster key={g} genre={g} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="ui ui--tv">
      <aside className="ui-side" aria-hidden="true">
        <img src={site.brand.logo} alt="" width="20" height="20" loading="lazy" />
        {['search', 'home', 'film', 'series', 'ball', 'tv'].map((n, i) => (
          <Icon key={n} name={n} className={`ui-ico ${i === 1 ? 'on' : ''}`} />
        ))}
      </aside>
      <div className="ui-main">
        <div className="ui-hero ui-hero--tv">
          <Poster genre="series" ratio="fill" />
          <div className="ui-hero__txt">
            <span className="ui-chip">Nova temporada</span>
            <b>Cidade Neon</b>
            <small>Drama · Suspense · Série</small>
            <span className="ui-btn">
              <Icon name="play" /> Assistir agora
            </span>
          </div>
        </div>
        <span className="ui-row-title">Lançamentos em destaque</span>
        <div className="ui-row ui-row--tv">
          {row.map((g, i) => (
            <Poster key={g} genre={g} className={i === 0 ? 'is-focus' : ''} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function TV({ className = '', children }) {
  return (
    <div className={`dev dev--tv ${className}`}>
      <div className="dev__screen">{children || <StreamScreen variant="tv" />}</div>
      <div className="dev__stand" />
    </div>
  );
}

export function Tablet({ className = '', children }) {
  return (
    <div className={`dev dev--tablet ${className}`}>
      <div className="dev__screen">{children || <StreamScreen variant="tablet" />}</div>
    </div>
  );
}

export function Phone({ className = '', children }) {
  return (
    <div className={`dev dev--phone ${className}`}>
      <div className="dev__screen">{children || <StreamScreen variant="phone" />}</div>
    </div>
  );
}

export function Laptop({ className = '', children }) {
  return (
    <div className={`dev dev--laptop ${className}`}>
      <div className="dev__screen">{children || <StreamScreen variant="tablet" />}</div>
      <div className="dev__base" />
    </div>
  );
}

export function TvBox({ className = '' }) {
  return (
    <div className={`dev--box ${className}`} aria-hidden="true">
      <span />
    </div>
  );
}
