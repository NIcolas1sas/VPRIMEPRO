import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import Icon from './Icon.jsx';
import './Notice.css';

/**
 * Aviso modal usado enquanto links reais (checkout, WhatsApp,
 * documentos legais) não estiverem configurados.
 * Deixa claro que é uma DEMONSTRAÇÃO e que nada foi contratado.
 */
const NoticeContext = createContext(() => {});

export const useNotice = () => useContext(NoticeContext);

export function NoticeProvider({ children }) {
  const [notice, setNotice] = useState(null);
  const closeRef = useRef(null);
  const lastFocus = useRef(null);

  const open = useCallback((n) => {
    lastFocus.current = document.activeElement;
    setNotice(n);
  }, []);
  const close = useCallback(() => setNotice(null), []);

  useEffect(() => {
    if (!notice) {
      lastFocus.current?.focus?.();
      return undefined;
    }
    closeRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && close();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [notice, close]);

  return (
    <NoticeContext.Provider value={open}>
      {children}
      {notice && (
        <div className="notice" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && close()}>
          <div className="notice__panel glass" role="dialog" aria-modal="true" aria-labelledby="notice-title">
            <button ref={closeRef} className="notice__close" onClick={close} aria-label="Fechar aviso">
              <Icon name="close" />
            </button>
            <span className="demo-tag">
              <Icon name="info" className="notice__tag-icon" /> Modo demonstração
            </span>
            <h3 id="notice-title">{notice.title}</h3>
            <p>{notice.text}</p>
            {notice.detail && <p className="notice__detail">{notice.detail}</p>}
            <div className="notice__actions">
              <button className="btn btn--primary btn--sm" onClick={close}>
                Entendi
              </button>
            </div>
          </div>
        </div>
      )}
    </NoticeContext.Provider>
  );
}
