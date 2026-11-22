import { site } from '../../config/site.js';
import './VideoSlot.css';

/**
 * Espaço reservado para os vídeos promocionais (segunda etapa).
 * Enquanto `src` e `embedUrl` estiverem vazios em site.videos[slot],
 * o componente NÃO renderiza nada — sem players falsos.
 *
 * slot: 'presentation' | 'sports' | 'catalog'
 */
export default function VideoSlot({ slot, className = '' }) {
  const video = site.videos[slot];
  if (!video || (!video.src && !video.embedUrl)) return null;

  return (
    <figure className={`video-slot reveal ${className}`} data-video-slot={slot}>
      <div className="video-slot__frame">
        {video.embedUrl ? (
          <iframe
            src={video.embedUrl}
            title={video.title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video controls preload="metadata" playsInline poster={video.poster || undefined}>
            <source src={video.src} />
            Seu navegador não suporta a reprodução de vídeos.
          </video>
        )}
      </div>
      <figcaption className="sr-only">{video.title}</figcaption>
    </figure>
  );
}
