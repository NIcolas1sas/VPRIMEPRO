import { useId } from 'react';
import './Poster.css';

/**
 * Arte ILUSTRATIVA de capa, desenhada em SVG.
 * Não representa títulos reais nem conteúdos de terceiros.
 */
const themes = {
  action: { from: '#1a0614', to: '#ff5a3c', accent: '#ffb36b' },
  comedy: { from: '#5b1166', to: '#ffb347', accent: '#ffe08a' },
  drama: { from: '#0c1238', to: '#5421a8', accent: '#c9b6ff' },
  thriller: { from: '#040208', to: '#3a0d2e', accent: '#ff3d6e' },
  scifi: { from: '#05021f', to: '#3b1a8f', accent: '#7ee0ff' },
  animation: { from: '#2a63d8', to: '#c06bff', accent: '#ffe37a' },
  series: { from: '#0d0626', to: '#7629d9', accent: '#ff9be8' },
  documentary: { from: '#0b2230', to: '#d58a4b', accent: '#ffd9a3' },
  novela: { from: '#3b0a35', to: '#f05bcb', accent: '#ffd0b5' },
  sports: { from: '#071a14', to: '#5421a8', accent: '#9dffb8' },
};

function Motif({ genre, a }) {
  switch (genre) {
    case 'action':
      return (
        <>
          <circle cx="100" cy="150" r="80" fill={a} opacity=".22" />
          <circle cx="100" cy="150" r="46" fill={a} opacity=".35" />
          <path d="M0 240 L60 200 L95 225 L140 190 L200 215 V300 H0Z" fill="#12030d" />
          <path d="M92 120c6 0 10 4 10 9s-4 9-10 9-9-4-9-9 3-9 9-9zm-6 22h14l14 22-6 4-10-14-2 20 14 26h-9l-12-22-8 22h-9l10-30 2-18-10 10-7-4z" fill="#12030d" />
          {[30, 160, 52, 140, 175].map((x, i) => (
            <circle key={i} cx={x} cy={60 + i * 22} r="1.8" fill={a} />
          ))}
        </>
      );
    case 'comedy':
      return (
        <>
          <circle cx="60" cy="80" r="34" fill={a} opacity=".35" />
          <circle cx="150" cy="120" r="22" fill="#fff" opacity=".18" />
          <circle cx="40" cy="200" r="14" fill="#fff" opacity=".18" />
          <circle cx="100" cy="170" r="52" fill={a} opacity=".9" />
          <circle cx="82" cy="158" r="6" fill="#3d0a3f" />
          <circle cx="118" cy="158" r="6" fill="#3d0a3f" />
          <path d="M74 180q26 26 52 0" stroke="#3d0a3f" strokeWidth="6" fill="none" strokeLinecap="round" />
        </>
      );
    case 'drama':
      return (
        <>
          <circle cx="140" cy="80" r="30" fill={a} opacity=".55" />
          {Array.from({ length: 18 }).map((_, i) => (
            <line key={i} x1={i * 12} y1={i % 3 === 0 ? 20 : 0} x2={i * 12 - 18} y2={300} stroke="#fff" strokeOpacity=".07" />
          ))}
          <path d="M40 300V220c0-30 18-60 46-66-8-8-10-20-6-32 4-14 18-22 32-20 16 2 26 16 24 32l10 14-8 4c0 10-4 18-14 20l4 30c20 8 32 24 32 48V300z" fill="#070a22" />
        </>
      );
    case 'thriller':
      return (
        <>
          <circle cx="100" cy="95" r="44" fill={a} opacity=".75" />
          <circle cx="100" cy="95" r="70" fill={a} opacity=".12" />
          {[10, 38, 66, 134, 162, 190].map((x, i) => (
            <path key={i} d={`M${x} 300 L${x - 2} ${150 + (i % 3) * 18} L${x - 16} ${200 + (i % 2) * 10} L${x - 1} ${185} L${x - 20} ${236} L${x} 226 L${x + 20} 236 L${x + 1} 185 L${x + 16} ${200 + (i % 2) * 10} L${x + 2} ${150 + (i % 3) * 18}Z`} fill="#040208" />
          ))}
          <rect x="0" y="255" width="200" height="45" fill="#040208" />
        </>
      );
    case 'scifi':
      return (
        <>
          {Array.from({ length: 26 }).map((_, i) => (
            <circle key={i} cx={(i * 47) % 200} cy={(i * 71) % 300} r={i % 4 === 0 ? 1.6 : 0.9} fill="#fff" opacity=".7" />
          ))}
          <circle cx="104" cy="140" r="52" fill={a} opacity=".85" />
          <circle cx="92" cy="128" r="52" fill="#120640" opacity=".55" />
          <ellipse cx="104" cy="142" rx="92" ry="16" fill="none" stroke={a} strokeWidth="3" opacity=".8" transform="rotate(-14 104 142)" />
          <path d="M0 270q100-40 200 0v30H0z" fill="#05021f" />
        </>
      );
    case 'animation':
      return (
        <>
          <circle cx="150" cy="70" r="26" fill={a} />
          <path d="M30 90q10-16 26-8 10-14 26 0 14 2 10 14H32q-8-2-2-6z" fill="#fff" opacity=".85" />
          <path d="M-10 230q60-60 120-10t110-20V300H-10z" fill="#5be0a1" opacity=".9" />
          <path d="M-10 260q70-40 130 0t90-10V300H-10z" fill="#2fb57b" />
          <circle cx="70" cy="215" r="10" fill="#fff" />
          <circle cx="73" cy="213" r="3" fill="#2a1a50" />
        </>
      );
    case 'series':
      return (
        <>
          <circle cx="100" cy="110" r="70" fill={a} opacity=".18" />
          {[
            [0, 170, 30], [28, 140, 26], [52, 190, 22], [72, 120, 30], [100, 160, 24], [122, 100, 28], [148, 175, 26], [172, 135, 30],
          ].map(([x, y, w], i) => (
            <g key={i}>
              <rect x={x} y={y} width={w} height={300 - y} fill="#0b0420" />
              {Array.from({ length: 6 }).map((_, j) => (
                <rect key={j} x={x + 5 + (j % 2) * 10} y={y + 10 + Math.floor(j / 2) * 16} width="5" height="7" fill={a} opacity={(i + j) % 3 ? 0.55 : 0.15} />
              ))}
            </g>
          ))}
        </>
      );
    case 'documentary':
      return (
        <>
          <circle cx="100" cy="120" r="36" fill={a} opacity=".9" />
          <path d="M-10 220 L50 140 L90 190 L130 120 L210 220 V300 H-10Z" fill="#1d3a4a" />
          <path d="M-10 250 L40 200 L80 235 L140 180 L210 245 V300 H-10Z" fill="#0e2230" />
          <path d="M120 120l10 0 10 18-8-6-6 8z" fill="#fff" opacity=".7" />
        </>
      );
    case 'novela':
      return (
        <>
          <circle cx="100" cy="170" r="58" fill={a} opacity=".9" />
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x="30" y={180 + i * 12} width="140" height="4" fill="#3b0a35" opacity=".6" />
          ))}
          <rect x="0" y="210" width="200" height="90" fill="#2a0626" />
          <path d="M150 210c0-30 4-60 14-80M164 130c-14-6-30-2-38 8M164 130c12-10 26-10 34-2M164 130c-2-14-12-22-24-22M164 130c8-12 22-14 30-8" stroke="#1a0418" strokeWidth="4" fill="none" strokeLinecap="round" />
        </>
      );
    case 'sports':
      return (
        <>
          <path d="M-20 300 L60 150 H140 L220 300Z" fill="#14402c" opacity=".9" />
          <path d="M100 150 V300 M40 225 H160" stroke="#fff" strokeOpacity=".35" strokeWidth="2" />
          <ellipse cx="100" cy="225" rx="24" ry="10" fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth="2" />
          <circle cx="40" cy="40" r="26" fill="#fff" opacity=".2" />
          <circle cx="160" cy="40" r="26" fill="#fff" opacity=".2" />
          <circle cx="100" cy="120" r="22" fill="#fff" />
          <path d="M100 108l9 6.5-3.4 10.5H94.4L91 114.5z" fill="#1a0f30" />
        </>
      );
    default:
      return null;
  }
}

export default function Poster({ genre = 'series', title, label, className = '', ratio = 'portrait', tone = 0, flip = false }) {
  const id = useId().replace(/:/g, '');
  const t = themes[genre] || themes.series;
  const style = tone || flip ? { filter: tone ? `hue-rotate(${tone}deg)` : undefined, transform: flip ? 'scaleX(-1)' : undefined } : undefined;
  return (
    <div className={`poster poster--${ratio} ${className}`}>
      <svg viewBox="0 0 200 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true" style={style}>
        <defs>
          <linearGradient id={`g${id}`} x1="0" y1="0" x2="0.4" y2="1">
            <stop offset="0" stopColor={t.from} />
            <stop offset="1" stopColor={t.to} />
          </linearGradient>
          <radialGradient id={`v${id}`} cx="0.5" cy="0.35" r="0.85">
            <stop offset="0.55" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity=".55" />
          </radialGradient>
        </defs>
        <rect width="200" height="300" fill={`url(#g${id})`} />
        <Motif genre={genre} a={t.accent} />
        <rect width="200" height="300" fill={`url(#v${id})`} />
      </svg>
      {(title || label) && (
        <div className="poster__meta">
          {label && <span className="poster__label">{label}</span>}
          {title && <span className="poster__title">{title}</span>}
        </div>
      )}
    </div>
  );
}
