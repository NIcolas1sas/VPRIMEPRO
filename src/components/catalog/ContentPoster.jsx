import Poster from '../ui/Poster.jsx';

/**
 * Uma capa do carrossel.
 * - Com `src`: imagem real (lazy, sem distorção, proporção 2:3).
 * - Sem `src`: arte ilustrativa própria (SVG).
 */
export default function ContentPoster({ item, hidden }) {
  return (
    <li className="cposter" aria-hidden={hidden || undefined}>
      <div className="cposter__card">
        {item.src ? (
          <img
            className="cposter__img"
            src={item.src}
            alt={hidden ? '' : item.title}
            width="400"
            height="600"
            loading="lazy"
            decoding="async"
            draggable="false"
          />
        ) : (
          <Poster genre={item.genre} title={item.title} tone={item.tone} flip={item.flip} ratio="fill" />
        )}
        {!item.src && !hidden && <span className="sr-only">{item.title} (capa ilustrativa)</span>}
      </div>
    </li>
  );
}
