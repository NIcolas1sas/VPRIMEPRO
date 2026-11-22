import Icon from './ui/Icon.jsx';
import './Benefits.css';

const items = [
  { icon: 'film', title: 'Filmes e séries', text: 'Mais de 60 mil títulos para maratonar.' },
  { icon: 'ball', title: 'Esportes', text: 'Campeonatos e jogos ao vivo.' },
  { icon: 'tv', title: 'Canais de TV', text: '+500 canais com guia de programação.' },
  { icon: 'devices', title: 'Multidispositivos', text: 'Smart TV, celular, TV Box e PC.' },
];

export default function Benefits() {
  return (
    <section id="beneficios" className="benefits" aria-label="Principais benefícios">
      <div className="container">
        <ul className="benefits__bar glass reveal reveal-stagger">
          {items.map((it, i) => (
            <li key={it.title} className="benefits__item" style={{ '--d': `${i * 80}ms` }}>
              <span className="icon-badge">
                <Icon name={it.icon} />
              </span>
              <div>
                <h3>{it.title}</h3>
                <p>{it.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
