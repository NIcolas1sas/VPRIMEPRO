import Icon from '../ui/Icon.jsx';

export default function CategoryBar({ categories }) {
  return (
    <ul className="catbar" aria-label="Categorias de conteúdo">
      {categories.map((c) => (
        <li key={c.label} className="catbar__item">
          <Icon name={c.icon} />
          <span>{c.label}</span>
        </li>
      ))}
    </ul>
  );
}
