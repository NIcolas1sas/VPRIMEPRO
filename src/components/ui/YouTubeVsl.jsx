import { useEffect, useRef, useState } from 'react';
import './YouTubeVsl.css';

/**
 * VSL com YouTube carregado sob demanda (API oficial de incorporação).
 *
 * - Ao abrir a página: só a thumbnail (nenhum script do YouTube).
 * - Ao passar o mouse/tocar: pré-carrega a API (script leve).
 * - Ao clicar em PLAY: cria o player na mesma moldura e inicia o vídeo,
 *   com os controles oficiais do YouTube (play/pausa, progresso, volume,
 *   qualidade e velocidade na engrenagem, tela cheia).
 * - Só um vídeo toca por vez; cada VSL cria no máximo um player.
 */

let apiPromise = null;
function loadYouTubeApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (!apiPromise) {
    apiPromise = new Promise((resolve, reject) => {
      const previous = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previous?.();
        resolve(window.YT);
      };
      const s = document.createElement('script');
      s.src = 'https://www.youtube.com/iframe_api';
      s.async = true;
      s.onerror = () => {
        apiPromise = null;
        reject(new Error('YouTube API indisponível'));
      };
      document.head.appendChild(s);
    });
  }
  return apiPromise;
}

/** Players ativos — ao iniciar um, os outros pausam. */
const activePlayers = new Set();

export default function YouTubeVsl({ videoId, poster, title = 'Vídeo', priority = false, onStart }) {
  const rootRef = useRef(null);
  const hostRef = useRef(null);
  const [state, setState] = useState('idle'); // idle | loading | playing | fallback
  const [inView, setInView] = useState(false);

  // Animação de entrada (uma vez)
  useEffect(() => {
    const el = rootRef.current;
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
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Cria o player somente depois do clique
  useEffect(() => {
    if (state !== 'loading') return undefined;
    let player = null;
    let reveal = 0;
    let poll = 0;
    let cancelled = false;
    const host = hostRef.current;

    loadYouTubeApi()
      .then((YT) => {
        if (cancelled || !host) return;
        const target = document.createElement('div');
        host.replaceChildren(target);
        player = new YT.Player(target, {
          videoId,
          width: '100%',
          height: '100%',
          playerVars: {
            autoplay: 1,
            controls: 1,
            fs: 1,
            rel: 0,
            playsinline: 1,
            iv_load_policy: 3,
            origin: window.location.origin,
          },
          events: {
            onReady: (e) => {
              activePlayers.add(e.target);
              e.target.playVideo();
              // Rede de segurança: confere o estado caso algum evento atrase
              poll = window.setInterval(() => {
                const st = e.target.getPlayerState?.();
                if (st === YT.PlayerState.PLAYING || st === YT.PlayerState.BUFFERING) {
                  window.clearInterval(poll);
                  setState('playing');
                }
              }, 500);
              // Se o navegador bloquear o início automático (alguns celulares),
              // libera o player do YouTube para o visitante tocar no play dele.
              reveal = window.setTimeout(() => setState('playing'), 1500);
            },
            onStateChange: (e) => {
              if (e.data === YT.PlayerState.PLAYING) {
                setState('playing');
                activePlayers.forEach((p) => p !== e.target && p.pauseVideo?.());
              }
            },
          },
        });
      })
      .catch(() => !cancelled && setState('fallback'));

    return () => {
      cancelled = true;
      window.clearTimeout(reveal);
      window.clearInterval(poll);
      if (player) {
        activePlayers.delete(player);
        player.destroy?.();
      }
      host?.replaceChildren();
    };
  }, [state === 'loading' || state === 'playing', videoId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (state === 'playing' || state === 'fallback') onStart?.();
  }, [state, onStart]);

  const start = () => state === 'idle' && setState('loading');
  const warmUp = () => {
    loadYouTubeApi().catch(() => {});
  };

  const covered = state === 'idle' || state === 'loading';

  return (
    <div
      ref={rootRef}
      className={`ytv ${inView ? 'is-in' : ''} ${covered ? '' : 'is-playing'} ${state === 'loading' ? 'is-loading' : ''}`}
    >
      {/* Player do YouTube (criado sob demanda) */}
      <div ref={hostRef} className="ytv__host" />

      {/* Plano B: incorporação direta caso a API seja bloqueada */}
      {state === 'fallback' && (
        <iframe
          className="ytv__host"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
        />
      )}

      {/* Capa: thumbnail + máscara + PLAY */}
      <div className="ytv__cover" aria-hidden={!covered}>
        {poster && (
          <img
            className="ytv__poster"
            src={poster}
            alt=""
            width="1672"
            height="941"
            loading={priority ? 'eager' : 'lazy'}
            fetchpriority={priority ? 'high' : undefined}
            decoding="async"
            draggable="false"
          />
        )}
        <span className="ytv__mask" aria-hidden="true" />
        <button
          type="button"
          className="ytv__play"
          onClick={start}
          onPointerEnter={warmUp}
          onTouchStart={warmUp}
          onFocus={warmUp}
          tabIndex={covered ? 0 : -1}
          aria-label={`Reproduzir vídeo: ${title}`}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 5.6v12.8a.8.8 0 0 0 1.2.7l10.2-6.4a.8.8 0 0 0 0-1.4L9.2 4.9a.8.8 0 0 0-1.2.7z" />
          </svg>
          <span className="ytv__spinner" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
