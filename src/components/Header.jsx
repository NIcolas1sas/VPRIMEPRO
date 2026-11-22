import { useEffect, useState } from 'react';
import { site } from '../config/site.js';
import { scrollToId } from '../lib/scroll.js';
import Icon from './ui/Icon.jsx';
import './Header.css';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('inicio');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Destaca o link da seção visível
  useEffect(() => {
    const sections = site.nav.map((n) => document.getElementById(n.id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const go = (id) => (e) => {
    e.preventDefault();
    setOpen(false);
    scrollToId(id);
  };

  return (
    <header className={`header ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
      <div className="container header__inner">
        <a href="#inicio" className="header__brand" onClick={go('inicio')} aria-label={`${site.brand.name} — início`}>
          <img src={site.brand.logo} alt="" width="40" height="40" />
          <span>
            V PRIME <b>PRO</b>
          </span>
        </a>

        <nav className="header__nav" aria-label="Navegação principal">
          <ul>
            {site.nav.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} onClick={go(item.id)} className={active === item.id ? 'is-active' : ''}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a href="#planos" className="btn btn--primary btn--sm header__cta" onClick={go('planos')}>
          Quero assinar
        </a>

        <button
          className="header__toggle"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <Icon name={open ? 'close' : 'menu'} />
        </button>
      </div>

      <div id="mobile-menu" className="mobile-menu" hidden={!open}>
        <nav aria-label="Navegação mobile">
          <ul>
            {site.nav.map((item, i) => (
              <li key={item.id} style={{ '--i': i }}>
                <a href={`#${item.id}`} onClick={go(item.id)}>
                  {item.label}
                  <Icon name="arrow" />
                </a>
              </li>
            ))}
          </ul>
          <a href="#planos" className="btn btn--primary btn--block" onClick={go('planos')}>
            Quero assinar
          </a>
        </nav>
      </div>
    </header>
  );
}
