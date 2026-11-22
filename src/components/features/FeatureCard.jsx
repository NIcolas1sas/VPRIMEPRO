import Icon from '../ui/Icon.jsx';

/** Card horizontal: texto à esquerda, imagem integrada à direita. */
export default function FeatureCard({ feature, pending, delay = 0 }) {
  const { image, imagePosition, icon, lines, text } = feature;
  const title = lines.map((l) => l.text).join(' ');

  return (
    <article className="fcard reveal" style={{ '--d': `${delay}ms` }} aria-label={title}>
      <div className="fcard__media" aria-hidden="true">
        <img src={image} alt="" loading="lazy" decoding="async" width="1672" height="941" style={{ objectPosition: imagePosition }} />
      </div>
      <span className="fcard__shade" aria-hidden="true" />

      <div className="fcard__body">
        <div className="fcard__head">
          <span className="fcard__icon" aria-hidden="true">
            {icon === '18+' ? <b className="fcard__18">18+</b> : <Icon name={icon} />}
          </span>
          <h3 className="fcard__title">
            {lines.map((l) => (
              <span key={l.text} className={l.accent ? 'is-accent' : undefined}>
                {l.text}
              </span>
            ))}
          </h3>
        </div>
        <p className="fcard__text">{text}</p>
      </div>
    </article>
  );
}
