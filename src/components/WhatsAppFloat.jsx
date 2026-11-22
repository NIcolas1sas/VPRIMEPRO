import { useEffect, useRef, useState } from 'react';
import { WhatsAppIcon } from './ui/BrandIcons.jsx';
import { site } from '../config/site.js';
import './WhatsAppFloat.css';

/**
 * Botão flutuante do WhatsApp (canto inferior direito).
 * 1º clique: mostra "Falar com o suporte". 2º clique: abre o WhatsApp.
 */
export default function WhatsAppFloat() {
  const url = site.support.whatsappUrl;
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  // fecha o balão ao clicar fora ou apertar Esc
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (!url) return null;

  const onClick = (e) => {
    if (!open) {
      e.preventDefault(); // primeiro clique só mostra o balão
      setOpen(true);
    } else {
      setOpen(false); // segundo clique segue o link
    }
  };

  return (
    <div ref={rootRef} className={`wafloat ${open ? 'is-open' : ''}`}>
      <a className="wafloat__bubble" href={url} target="_blank" rel="noopener noreferrer" tabIndex={open ? 0 : -1} aria-hidden={!open}>
        <strong>Falar com o suporte</strong>
        <span>Toque de novo para abrir o WhatsApp</span>
      </a>
      <a
        className="wafloat__btn"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        aria-label={open ? 'Abrir conversa no WhatsApp' : 'Falar com o suporte pelo WhatsApp'}
        aria-expanded={open}
      >
        <WhatsAppIcon />
      </a>
    </div>
  );
}
