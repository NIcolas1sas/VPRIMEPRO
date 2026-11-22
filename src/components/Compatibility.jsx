import { useEffect, useRef, useState } from 'react';
import Icon from './ui/Icon.jsx';
import { site } from '../config/site.js';
import './Compatibility.css';

/** Imagem dos aparelhos (PNG/WebP com fundo transparente). */
const DEVICES_IMG = '/images/devices-v-prime-pro.webp';

const SYNC_CARD = { icon: 'sync', title: 'Sincronização total', text: 'Continue de onde parou.' };
// Usado enquanto a sincronização entre aparelhos não for confirmada
const SYNC_FALLBACK = { icon: 'grid', title: 'Fácil de usar', text: 'Navegação simples e intuitiva em qualquer tela.' };

const benefits = [
  { icon: 'bolt', title: 'Acesso rápido', text: 'Seus dados chegam por e-mail após o pagamento.' },
  site.compat?.syncConfirmed ? SYNC_CARD : SYNC_FALLBACK,
  { icon: 'hd', title: 'Imagem até 4K', text: 'Qualidade SD, HD, Full HD e 4K.' },
  { icon: 'devices', title: 'Instalação guiada', text: 'Tutorial no e-mail e suporte no WhatsApp.' },
];

const devices = [
  { icon: 'tv', label: 'Smart TV' },
  { icon: 'phone', label: 'Smartphone' },
  { icon: 'tablet', label: 'Tablet' },
  { icon: 'box', label: 'TV Box' },
  { icon: 'laptop', label: 'Computador' },
];

export default function Compatibility() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  // Entrada disparada uma única vez
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) {
      setInView(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} id="compatibilidade" className={`compat ${inView ? 'is-in' : ''}`} aria-labelledby="compat-title">
      <div className="compat__bg" aria-hidden="true">
        <span className="compat__light compat__light--l" />
        <span className="compat__light compat__light--r" />
        <span className="compat__arc compat__arc--l" />
        <span className="compat__arc compat__arc--r" />
      </div>

      <div className="container compat__inner">
        <header className="compat__head">
          <span className="compat__eyebrow">
            <span className="compat__eyebrow-line" aria-hidden="true" />
            <Icon name="devices" />
            Compatibilidade
            <span className="compat__eyebrow-line" aria-hidden="true" />
          </span>
          <h2 id="compat-title" className="compat__title">
            <span>Assista</span> <em>onde e como quiser.</em>
          </h2>
          <p className="compat__lead">
            Comece o filme na Smart TV da sala e veja o próximo episódio no celular. A V PRIME PRO funciona nos aparelhos
            que você já tem em casa.
          </p>
        </header>

        <div className="compat__main">
          <figure className="compat__figure">
            <span className="compat__halo" aria-hidden="true" />
            <img
              className="compat__img"
              src={DEVICES_IMG}
              alt="Smart TV, notebook, tablet, smartphone e TV Box exibindo a marca V PRIME PRO"
              width="1774"
              height="887"
              loading="lazy"
              decoding="async"
            />
            <span className="compat__floor" aria-hidden="true" />
          </figure>

          <ul className="compat__cards">
            {benefits.map((b, i) => (
              <li key={b.title} className="compat__card" style={{ '--i': i }}>
                <span className="compat__card-icon" aria-hidden="true">
                  <Icon name={b.icon} />
                </span>
                <span>
                  <b>{b.title}</b>
                  <small>{b.text}</small>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <ul className="compat__devices" aria-label="Dispositivos">
          {devices.map((d, i) => (
            <li key={d.label} className="compat__device" style={{ '--i': i }}>
              <Icon name={d.icon} />
              {d.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
