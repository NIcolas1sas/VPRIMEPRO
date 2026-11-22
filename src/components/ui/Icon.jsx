/** Conjunto de ícones em SVG inline (sem dependências externas). */
const paths = {
  film: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M7 3v18M17 3v18M3 8h4M3 12h4M3 16h4M17 8h4M17 12h4M17 16h4" />
    </>
  ),
  series: (
    <>
      <rect x="2.5" y="5" width="19" height="13" rx="2.5" />
      <path d="M8 21h8M10.5 9.5v5l4-2.5-4-2.5z" />
    </>
  ),
  ball: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5l4 2.9-1.5 4.7h-5L8 10.4 12 7.5zM12 3v4.5M21 10.5l-5 0M3 10.5h5M6.5 19l3-3.9M17.5 19l-3-3.9" />
    </>
  ),
  tv: (
    <>
      <rect x="2.5" y="6" width="19" height="13" rx="2.5" />
      <path d="M8 2.5l4 3.5 4-3.5" />
    </>
  ),
  devices: (
    <>
      <rect x="2" y="4" width="14" height="10" rx="2" />
      <path d="M6 18h6M9 14v4" />
      <rect x="17" y="8" width="5" height="11" rx="1.5" />
    </>
  ),
  phone: (
    <>
      <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
      <path d="M11 18.5h2" />
    </>
  ),
  box: (
    <>
      <rect x="3" y="9" width="18" height="8" rx="2.5" />
      <path d="M7 13h.01M11 13h6M8 9l-2-5M16 9l2-5" />
    </>
  ),
  laptop: (
    <>
      <rect x="4" y="4.5" width="16" height="11" rx="2" />
      <path d="M2 19.5h20" />
    </>
  ),
  grid: (
    <>
      <rect x="3" y="3" width="7.5" height="7.5" rx="2" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="2" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="2" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2" />
    </>
  ),
  bolt: <path d="M13 2.5L4.5 13.5H12l-1 8 8.5-11H12l1-8z" />,
  sparkle: (
    <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16z" />
  ),
  headset: (
    <>
      <path d="M4 14v-2a8 8 0 0116 0v2" />
      <rect x="2.5" y="13" width="4.5" height="7" rx="2" />
      <rect x="17" y="13" width="4.5" height="7" rx="2" />
      <path d="M19.5 20c0 1.5-2 2-5 2" />
    </>
  ),
  layers: <path d="M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5M3 17.5l9 5 9-5" />,
  shield: (
    <>
      <path d="M12 2.5l8 3.2v6.1c0 4.8-3.4 8.4-8 9.7-4.6-1.3-8-4.9-8-9.7V5.7l8-3.2z" />
      <path d="M8.5 12l2.5 2.5 4.5-5" />
    </>
  ),
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  chevron: <path d="M6 9l6 6 6-6" />,
  star: <path d="M12 3.2l2.7 5.6 6.1.8-4.5 4.2 1.1 6-5.4-2.9-5.4 2.9 1.1-6-4.5-4.2 6.1-.8L12 3.2z" />,
  user: (
    <>
      <circle cx="12" cy="8.5" r="4" />
      <path d="M4 21c1-4 4.3-6 8-6s7 2 8 6" />
    </>
  ),
  chat: <path d="M21 11.5a8.5 8.5 0 01-12.6 7.4L3 20.5l1.6-5.2A8.5 8.5 0 1121 11.5z" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  play: <path d="M8 5.5v13l10.5-6.5L8 5.5z" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M20 20l-4.2-4.2" />
    </>
  ),
  home: <path d="M3.5 11L12 4l8.5 7M6 9.5V20h12V9.5" />,
  live: (
    <>
      <circle cx="12" cy="12" r="2.4" />
      <path d="M8 8.2a5.4 5.4 0 000 7.6M16 8.2a5.4 5.4 0 010 7.6M5.2 5.4a9.4 9.4 0 000 13.2M18.8 5.4a9.4 9.4 0 010 13.2" />
    </>
  ),
  sync: <path d="M20 11a8 8 0 00-14.3-4.9L4 8M4 4v4h4M4 13a8 8 0 0014.3 4.9L20 16M20 20v-4h-4" />,
  hd: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="3" />
      <path d="M7 9v6M11 9v6M7 12h4M14 9v6h1.6a3 3 0 000-6H14z" />
    </>
  ),
  tablet: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="2.5" />
      <path d="M11 18h2" />
    </>
  ),
  camera: (
    <>
      <rect x="2.5" y="6" width="13" height="12" rx="2.5" />
      <path d="M15.5 10.5l6-3.5v10l-6-3.5" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c.6-3.6 3.2-5.5 6.5-5.5s5.9 1.9 6.5 5.5M15.5 4.8a3.5 3.5 0 010 6.4M18 14.8c1.9.7 3.1 2.4 3.5 5.2" />
    </>
  ),
  diamond: <path d="M6.5 4h11l4 5.5L12 21 2.5 9.5 6.5 4zM2.5 9.5h19M9 4l-1.5 5.5L12 21l4.5-11.5L15 4" />,
  coins: (
    <>
      <ellipse cx="12" cy="6" rx="7" ry="3" />
      <path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
    </>
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 2.8l1.6 2.4 2.8-.7.7 2.8 2.4 1.6-1.3 2.6 1.3 2.6-2.4 1.6-.7 2.8-2.8-.7L12 21.2l-1.6-2.4-2.8.7-.7-2.8-2.4-1.6 1.3-2.6-1.3-2.6 2.4-1.6.7-2.8 2.8.7L12 2.8z" />
    </>
  ),
  card: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
      <path d="M2.5 9.5h19M6 15h4" />
    </>
  ),
  award: (
    <>
      <circle cx="12" cy="9" r="6" />
      <path d="M12 6.2l.9 1.8 2 .3-1.45 1.4.35 2-1.8-.95-1.8.95.35-2L9.1 8.3l2-.3.9-1.8zM8.5 14l-2 7 5.5-2.5L17.5 21l-2-7" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2.5" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </>
  ),
  wallet: (
    <>
      <path d="M3 7.5A2.5 2.5 0 015.5 5H18v4" />
      <rect x="3" y="7.5" width="18" height="12" rx="2.5" />
      <path d="M16.5 13.5h.01" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6M12 7.5h.01" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="M3.5 6.5l8.5 6.5 8.5-6.5" />
    </>
  ),
  trophy: (
    <>
      <path d="M7 4h10v5a5 5 0 01-10 0V4zM7 6H4v1.5A3.5 3.5 0 007.5 11M17 6h3v1.5a3.5 3.5 0 01-3.5 3.5M12 14v3M8 21h8M9.5 17h5v4h-5z" />
    </>
  ),
  clapper: (
    <>
      <path d="M3.5 10h17v9a1.5 1.5 0 01-1.5 1.5H5A1.5 1.5 0 013.5 19v-9z" />
      <path d="M3.2 9.8l-.6-3.2 15.7-2.9.6 3.2L3.2 9.8zM7.4 4.9l2.5 3.6M12.2 4l2.5 3.6" />
    </>
  ),
  lock: (
    <>
      <rect x="4.5" y="10.5" width="15" height="10.5" rx="2.5" />
      <path d="M8 10.5V7.5a4 4 0 018 0v3M12 14.5v2.5" />
    </>
  ),
  monitor: (
    <>
      <rect x="2.5" y="4" width="19" height="12.5" rx="2" />
      <path d="M8 20.5h8M12 16.5v4" />
    </>
  ),
  mask: (
    <>
      <path d="M4 5c3 1.3 6 1.3 8 0v6.5c0 3.5-2 6-4 6s-4-2.5-4-6V5z" />
      <path d="M12 8.5c2 1.3 5 1.3 8 0V15c0 3.5-2 6-4 6s-4-2.5-4-6" />
      <path d="M6 10h1.5M9 10h.5M15 13.5h1M18 13.5h.5M14.5 17q1.5 1.2 3 0M6.5 13.5q1.5-1 3 0" />
    </>
  ),
  smile: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 14.5q3.5 3 7 0M9 9.5h.01M15 9.5h.01M9 4.5q3-2.5 6 0" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
};

export default function Icon({ name, className, strokeWidth = 1.8, title }) {
  const filled = name === 'star' || name === 'play';
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
    >
      {title && <title>{title}</title>}
      {paths[name]}
    </svg>
  );
}
