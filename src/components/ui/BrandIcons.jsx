/* Ícones ilustrados usados na seção de planos (card de instalação e suporte). */

/** Envelope com "@" e selo de confirmação. */
export function MailCheckIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 96 96" aria-hidden="true">
      <defs>
        <linearGradient id="mi-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#b36bff" />
          <stop offset="1" stopColor="#7629d9" />
        </linearGradient>
        <linearGradient id="mi-flap" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d9a8ff" />
          <stop offset="1" stopColor="#9b4dff" />
        </linearGradient>
      </defs>
      {/* carta */}
      <rect x="22" y="10" width="46" height="40" rx="6" fill="#f3e8ff" />
      <text x="45" y="38" textAnchor="middle" fontSize="24" fontWeight="800" fill="#d52bbd" fontFamily="Arial, sans-serif">
        @
      </text>
      {/* envelope */}
      <path d="M8 36 L46 58 L84 36 V78 a6 6 0 0 1 -6 6 H14 a6 6 0 0 1 -6 -6 Z" fill="url(#mi-body)" />
      <path d="M8 36 L46 62 L84 36 L84 40 L46 66 L8 40 Z" fill="#5a1fb0" opacity=".5" />
      <path d="M8 84 L38 58 M84 84 L54 58" stroke="url(#mi-flap)" strokeWidth="3" opacity=".6" />
      {/* selo verde */}
      <circle cx="76" cy="74" r="15" fill="#22c55e" stroke="#fff" strokeWidth="3" />
      <path d="M69 74.5 L74 79.5 L83.5 69.5" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Logo do WhatsApp (glifo oficial, verde da marca). */
export function WhatsAppIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#25D366"
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
      />
    </svg>
  );
}
