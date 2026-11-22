import { useRef, useState } from 'react';
import Icon from './Icon.jsx';
import { useNotice } from './Notice.jsx';
import { site } from '../../config/site.js';
import YouTubeVsl from './YouTubeVsl.jsx';
import './VideoPlayer.css';

/**
 * Card de vídeo premium (16:9) com borda luminosa animada.
 * Reutilizável: <VideoPlayer slot="presentation" />
 *
 * Configuração em site.videos[slot]:
 *  - src       arquivo (ex.: '/videos/apresentacao.mp4')
 *  - embedUrl  alternativa: URL de embed (YouTube/Vimeo)
 *  - poster    imagem de capa
 *  - controls / muted / loop
 *  - label     texto exibido enquanto não houver vídeo
 *
 * Sem src/embedUrl: mostra a apresentação visual com o play,
 * sem nenhum vídeo genérico.
 */
export default function VideoPlayer({ slot = 'presentation', className = '', priority = false }) {
  const video = site.videos[slot] || {};
  const notice = useNotice();
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);

  const hasYouTube = Boolean(video.youtubeId);
  const hasFile = !hasYouTube && Boolean(video.src);
  const hasEmbed = !hasYouTube && !hasFile && Boolean(video.embedUrl);
  const configured = hasYouTube || hasFile || hasEmbed;

  const handlePlay = () => {
    if (hasFile) {
      const el = ref.current;
      if (!el) return;
      if (el.paused) el.play().catch(() => {});
      else el.pause();
      return;
    }
    if (hasEmbed) {
      setStarted(true);
      return;
    }
    notice({
      title: video.title || 'Vídeo de apresentação',
      text: video.noticeText || 'O vídeo de apresentação da V PRIME PRO será adicionado em breve.',
      detail: `Para ativar: coloque o arquivo em public/videos/ e informe o caminho em ${video.envVar || 'VITE_VIDEO_PRESENTATION'} (arquivo .env).`,
    });
  };

  const embedSrc = hasEmbed
    ? `${video.embedUrl}${video.embedUrl.includes('?') ? '&' : '?'}autoplay=1`
    : '';

  return (
    <div className={`vplayer ${playing ? 'is-playing' : ''} ${className}`}>
      <span className="vplayer__glow" aria-hidden="true" />
      <div className="vplayer__frame">
        <div className="vplayer__screen">
          {hasYouTube && (
            <YouTubeVsl
              videoId={video.youtubeId}
              poster={video.thumb}
              title={video.title}
              priority={priority}
              onStart={() => setPlaying(true)}
            />
          )}
          {hasFile && (
            <video
              ref={ref}
              className="vplayer__media"
              poster={video.poster || undefined}
              preload="metadata"
              playsInline
              muted={video.muted}
              loop={video.loop}
              controls={started && video.controls !== false}
              onPlay={() => {
                setPlaying(true);
                setStarted(true);
              }}
              onPause={() => setPlaying(false)}
              onEnded={() => setPlaying(false)}
            >
              <source src={video.src} />
              Seu navegador não suporta a reprodução de vídeos.
            </video>
          )}

          {hasEmbed && started && (
            <iframe
              className="vplayer__media"
              src={embedSrc}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}

          {!configured && (
            <div className="vplayer__placeholder" aria-hidden="true">
              <span className="vplayer__beam" />
              <span className="vplayer__grid" />
            </div>
          )}

          {!hasYouTube && (!started || (hasFile && !playing)) && (
            <div className="vplayer__overlay">
              {video.poster && !hasFile && <img className="vplayer__poster" src={video.poster} alt="" loading="lazy" />}
              <button
                type="button"
                className="vplayer__play"
                onClick={handlePlay}
                aria-label={`Reproduzir: ${video.title || 'vídeo'}`}
              >
                <span className="vplayer__play-ring" aria-hidden="true" />
                <Icon name="play" />
              </button>
              {!started && (
                <span className="vplayer__label">
                  <span className="vplayer__dot" aria-hidden="true" />
                  {video.label || video.title}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
