import { site } from '../../config/site.js';
import YouTubeVsl from './YouTubeVsl.jsx';
import './VslFrame.css';

/**
 * Moldura neon 16:9 para VSL.
 * Uso: <VslFrame slot="platform" badge="Visão geral da plataforma" />
 *
 * Lê site.videos[slot]:
 *  - src       arquivo em /public/videos (ex.: '/videos/vsl.mp4')
 *  - embedUrl  alternativa: URL de embed (YouTube/Vimeo)
 *  - poster    capa opcional do arquivo de vídeo
 *
 * Sem src/embedUrl: a área interna fica limpa e escura,
 * sem botão de play e sem conteúdo fictício.
 */
export default function VslFrame({ slot, badge, className = '' }) {
  const video = site.videos?.[slot] || {};
  const hasYouTube = Boolean(video.youtubeId);
  const hasFile = !hasYouTube && Boolean(video.src);
  const hasEmbed = !hasYouTube && !hasFile && Boolean(video.embedUrl);

  return (
    <div className={`vsl ${className}`}>
      <span className="vsl__glow" aria-hidden="true" />
      {badge && <span className="vsl__badge">{badge}</span>}
      <div className="vsl__frame">
        <div className="vsl__screen">
          {hasYouTube && <YouTubeVsl videoId={video.youtubeId} poster={video.thumb} title={video.title} />}
          {hasFile && (
            <video
              className="vsl__media"
              src={video.src}
              poster={video.poster || undefined}
              controls
              playsInline
              preload="metadata"
            >
              Seu navegador não suporta a reprodução de vídeos.
            </video>
          )}
          {hasEmbed && (
            <iframe
              className="vsl__media"
              src={video.embedUrl}
              title={video.title || 'Vídeo'}
              loading="lazy"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
            />
          )}
          {!hasYouTube && !hasFile && !hasEmbed && <span className="vsl__empty" aria-hidden="true" />}
        </div>
      </div>
    </div>
  );
}
