import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { site } from '../config/site.js';
import './Intro.css';

/**
 * ============================================================
 *  INTRO CINEMATOGRÁFICA — V PRIME PRO
 * ============================================================
 *  1. logo     (0 → ~0.9s)  símbolo V surge, cresce e acende
 *  2. brand    (→ ~2.0s)    símbolo vai à esquerda, nome surge
 *  3. dissolve (→ ~3.1s)    marca se desfaz em partículas (canvas)
 *  4. reveal   (→ ~4.1s)    partículas somem e o site aparece
 *
 *  Regras:
 *  - Toca a cada carregamento (ONCE_PER_SESSION = true limita a
 *    uma vez por sessão).
 *  - Não roda ao abrir um link com âncora (#planos etc.).
 *  - No celular: logo em cima e nome embaixo (layout vertical).
 *  - ?intro=1 na URL força a exibição (para revisão).
 * ============================================================
 */

const STORAGE_KEY = 'vpp:intro-seen';
// true = mostra só na primeira visita da sessão; false = sempre
const ONCE_PER_SESSION = false;

// Mesmo desenho do símbolo usado no SVG (viewBox 0 0 100 100)
const V_PATH =
  'M4 14 H35 L50 58 L65 14 H96 L56 92 H44 Z M20 22 L28 22 L50 76 L72 22 L80 22 L52 86 L48 86 Z';

const TIMING = {
  desktop: { brand: 1200, dissolve: 2900, reveal: 3950, done: 5000 },
  mobile: { brand: 1100, dissolve: 2600, reveal: 3600, done: 4600 },
};

function readSeen() {
  try {
    return window.sessionStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}
function markSeen() {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, '1');
  } catch {
    /* sessionStorage indisponível (modo privado): apenas não memoriza */
  }
}

function shouldPlay() {
  if (typeof window === 'undefined') return { play: false, force: false };
  const force = new URLSearchParams(window.location.search).get('intro') === '1';
  if (force) return { play: true, force: true };
  if (window.location.hash || (ONCE_PER_SESSION && readSeen())) return { play: false, force: false };
  return { play: true, force: false };
}

/* ---------- Sistema de partículas (canvas 2D) ---------- */
const PALETTE = [
  [118, 41, 217], // roxo vibrante
  [213, 43, 189], // magenta
  [240, 91, 203], // rosa luminoso
  [255, 155, 232], // rosa suave
  [255, 255, 255], // brilho
];

function runParticles(canvas, sources, { light, freezeAt = 0 }) {
  const dpr = Math.min(window.devicePixelRatio || 1, light ? 1.5 : 2);
  const w = window.innerWidth;
  const h = window.innerHeight;
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};

  // 1) Desenha a marca num canvas fora da tela para amostrar os pixels
  const off = document.createElement('canvas');
  off.width = canvas.width;
  off.height = canvas.height;
  const octx = off.getContext('2d', { willReadFrequently: true });
  octx.scale(dpr, dpr);

  let minX = Infinity;
  let maxX = -Infinity;
  let cx = 0;
  let cy = 0;
  let count = 0;

  sources.forEach((s) => {
    const r = s.el.getBoundingClientRect();
    if (!r.width) return;
    minX = Math.min(minX, r.left);
    maxX = Math.max(maxX, r.right);
    cx += r.left + r.width / 2;
    cy += r.top + r.height / 2;
    count += 1;

    if (s.type === 'symbol') {
      const p = new Path2D(V_PATH);
      const g = octx.createLinearGradient(r.left, 0, r.right, 0);
      g.addColorStop(0, '#7629d9');
      g.addColorStop(1, '#f05bcb');
      octx.save();
      octx.translate(r.left, r.top);
      octx.scale(r.width / 100, r.height / 100);
      octx.fillStyle = g;
      octx.fill(p, 'evenodd');
      octx.restore();
    } else {
      const cs = getComputedStyle(s.el);
      octx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      octx.textBaseline = 'middle';
      octx.fillStyle = s.color;
      if ('letterSpacing' in octx) octx.letterSpacing = cs.letterSpacing === 'normal' ? '0px' : cs.letterSpacing;
      octx.fillText(s.el.textContent, r.left, r.top + r.height / 2);
    }
  });
  if (!count) return () => {};
  cx /= count;
  cy /= count;

  const step = Math.max(2, Math.round((light ? 4 : 2.6) * dpr));
  const data = octx.getImageData(0, 0, off.width, off.height).data;
  const parts = [];
  const span = Math.max(1, (maxX - minX) * dpr);

  for (let y = 0; y < off.height; y += step) {
    for (let x = 0; x < off.width; x += step) {
      const i = (y * off.width + x) * 4;
      if (data[i + 3] < 120) continue;
      const dx = x - cx * dpr;
      const dy = y - cy * dpr;
      const dist = Math.hypot(dx, dy) || 1;
      const speed = (1 + Math.random() * 3.6) * dpr;
      const angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 1.3;
      parts.push({
        x0: x,
        y0: y,
        vx: Math.cos(angle) * speed + (dx / dist) * 1.1 * dpr,
        vy: Math.sin(angle) * speed * 0.8 - Math.random() * 1.2 * dpr,
        r0: data[i],
        g0: data[i + 1],
        b0: data[i + 2],
        to: PALETTE[(Math.random() * PALETTE.length) | 0],
        size: (Math.random() < 0.08 ? 2.6 : 0.9 + Math.random() * 1.5) * dpr,
        streak: Math.random() < (light ? 0.05 : 0.12), // rastro de luz
        delay: ((x - minX * dpr) / span) * 380 + Math.random() * 140,
        life: 900 + Math.random() * 700,
      });
    }
  }

  // Movimento calculado pelo tempo (independe da taxa de quadros):
  // velocidade com arrasto exponencial + leve subida.
  const DRAG = 0.985;
  const LN = Math.log(DRAG);
  const LIFT = 0.014 * dpr;
  const travel = (n) => (1 - Math.pow(DRAG, n)) / (1 - DRAG);

  let raf = 0;
  const start = performance.now();
  const total = 2600;

  const frame = (now) => {
    const t = now - start;
    if (light) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else {
      // rastro: apaga parcialmente o quadro anterior
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0,0,0,0.26)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.globalCompositeOperation = 'lighter';

    for (let k = 0; k < parts.length; k += 1) {
      const p = parts[k];
      const age = t - p.delay;
      if (age < 0) {
        ctx.fillStyle = `rgb(${p.r0},${p.g0},${p.b0})`;
        ctx.fillRect(p.x0, p.y0, step * 0.9, step * 0.9);
        continue;
      }
      const k01 = age / p.life;
      if (k01 >= 1) continue;
      const n = age / 16.67; // "quadros" equivalentes a 60fps
      const d = travel(n);
      const x = p.x0 + p.vx * d;
      const y = p.y0 + p.vy * d - (LIFT * (n - d)) / (1 - DRAG);
      const m = Math.min(1, k01 * 2.2);
      const r = (p.r0 + (p.to[0] - p.r0) * m) | 0;
      const g = (p.g0 + (p.to[1] - p.g0) * m) | 0;
      const b = (p.b0 + (p.to[2] - p.b0) * m) | 0;
      const flick = 0.7 + Math.random() * 0.3;
      const a = (1 - k01) * (1 - k01 * 0.3) * flick;
      const color = `rgba(${r},${g},${b},${a.toFixed(2)})`;
      const s = p.size * (1 - k01 * 0.4);
      if (p.streak) {
        // traço na direção do movimento (velocidade atual)
        const decay = Math.exp(LN * n);
        ctx.strokeStyle = color;
        ctx.lineWidth = s * 0.8;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - p.vx * decay * 7, y - p.vy * decay * 7);
        ctx.stroke();
      }
      ctx.fillStyle = color;
      ctx.fillRect(x, y, s, s);
    }

    if (freezeAt && t >= freezeAt) return;
    if (t < total) raf = requestAnimationFrame(frame);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
  raf = requestAnimationFrame(frame);
  return () => cancelAnimationFrame(raf);
}

/* Brilhos flutuantes do fundo: [x%, y%, tamanho, atraso, duração] */
const SPARKS = [
  [8, 22, 3, 0.1, 3.6], [18, 70, 2, 0.6, 4.2], [27, 38, 4, 0.3, 3.2], [36, 82, 2, 1.0, 4.6],
  [44, 16, 3, 0.4, 3.8], [57, 76, 2, 0.2, 4.0], [63, 28, 4, 0.8, 3.4], [72, 60, 3, 0.5, 4.4],
  [81, 18, 2, 0.9, 3.9], [90, 44, 3, 0.3, 3.5], [12, 50, 2, 1.2, 4.1], [86, 80, 4, 0.7, 3.7],
];

/* Letras do nome entram uma a uma (o texto continua o mesmo) */
function Letters({ text, start }) {
  return text.split('').map((ch, i) => (
    <span key={i} className="intro__char" style={{ '--i': start + i }}>
      {ch === ' ' ? ' ' : ch}
    </span>
  ));
}

/* ---------- Componente ---------- */
export default function Intro() {
  const [{ play, force }] = useState(shouldPlay);
  const [phase, setPhase] = useState(play ? 'logo' : 'off');
  const stageRef = useRef(null);
  const symbolRef = useRef(null);
  const nameRef = useRef(null);
  const primeRef = useRef(null);
  const proRef = useRef(null);
  const canvasRef = useRef(null);
  const timers = useRef([]);
  const light = useRef(false);

  // Antes da primeira pintura: trava a rolagem e esconde o Hero/Header
  useLayoutEffect(() => {
    if (!play) return undefined;
    const root = document.documentElement;
    root.classList.add('intro-playing');
    if (force) root.classList.add('motion-ok');
    window.scrollTo(0, 0);
    light.current = window.matchMedia('(max-width: 640px), (pointer: coarse)').matches;

    // centraliza o símbolo sozinho na etapa 1 (desloca metade do nome)
    const measure = () => {
      const stage = stageRef.current;
      const name = nameRef.current;
      if (!stage || !name) return;
      const cs = getComputedStyle(stage);
      if (cs.flexDirection === 'column') {
        // celular: nome embaixo → desloca o símbolo para baixo
        const gap = parseFloat(cs.rowGap) || 0;
        stage.style.setProperty('--shift', '0px');
        stage.style.setProperty('--shift-y', `${(name.offsetHeight + gap) / 2}px`);
        return;
      }
      const gap = parseFloat(cs.columnGap) || 0;
      // nome + divisória + 2 gaps, dividido por 2
      const divider = stage.querySelector('.intro__divider');
      const total = name.offsetWidth + (divider ? divider.offsetWidth : 0) + gap * 2;
      stage.style.setProperty('--shift', `${total / 2}px`);
      stage.style.setProperty('--shift-y', '0px');
    };
    measure();
    document.fonts?.ready.then(measure).catch(() => {});
    return undefined;
  }, [play, force]);

  const reveal = useCallback(() => {
    const root = document.documentElement;
    root.classList.remove('intro-playing');
    root.classList.add('intro-reveal');
    timers.current.push(setTimeout(() => root.classList.remove('intro-reveal'), 1800));
  }, []);

  // Linha do tempo
  useEffect(() => {
    if (!play) return undefined;
    if (!force) markSeen();
    const T = light.current ? TIMING.mobile : TIMING.desktop;
    const at = (ms, fn) => timers.current.push(setTimeout(fn, ms));

    // Revisão visual: ?intro=1&etapa=logo|brand|dissolve congela na etapa
    const hold = force ? new URLSearchParams(window.location.search).get('etapa') : null;
    if (hold === 'logo') return undefined;
    at(T.brand, () => setPhase('brand'));
    if (hold === 'brand') return undefined;
    at(T.dissolve, () => setPhase('dissolve'));
    if (hold === 'dissolve') return undefined;
    at(T.reveal, () => {
      setPhase('reveal');
      reveal();
    });
    at(T.done, () => setPhase('off'));

    const list = timers.current;
    return () => list.forEach(clearTimeout);
  }, [play, force, reveal]);

  // Partículas na etapa 3
  useEffect(() => {
    if (phase !== 'dissolve' || !canvasRef.current) return undefined;
    return runParticles(
      canvasRef.current,
      [
        { type: 'symbol', el: symbolRef.current },
        { type: 'text', el: primeRef.current, color: '#ffffff' },
        { type: 'text', el: proRef.current, color: '#f05bcb' },
      ],
      {
        light: light.current,
        // revisão visual: &t=600 congela as partículas nesse instante (ms)
        freezeAt: force ? Number(new URLSearchParams(window.location.search).get('t')) || 0 : 0,
      }
    );
  }, [phase]);

  // Ao terminar: limpa classes temporárias
  useEffect(() => {
    if (phase !== 'off' || !play) return;
    if (!force) document.documentElement.classList.remove('motion-ok');
  }, [phase, play, force]);

  if (phase === 'off') return null;

  return (
    <div
      className={`intro is-${phase} ${light.current ? 'is-light' : ''}`}
      role="dialog"
      aria-label={`Abertura ${site.brand.name}`}
    >
      <div className="intro__bg" aria-hidden="true">
        <span className="intro__glow" />
        <span className="intro__beam intro__beam--1" />
        <span className="intro__beam intro__beam--2" />
        <span className="intro__grid" />
        {SPARKS.map((sp, i) => (
          <span
            key={i}
            className="intro__spark"
            style={{ left: `${sp[0]}%`, top: `${sp[1]}%`, '--s': `${sp[2]}px`, animationDelay: `${sp[3]}s`, animationDuration: `${sp[4]}s` }}
          />
        ))}
        <svg className="intro__waves" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <defs>
            <linearGradient id="iw" x1="0" x2="1">
              <stop offset="0" stopColor="#7629d9" stopOpacity="0" />
              <stop offset="0.4" stopColor="#7629d9" />
              <stop offset="0.75" stopColor="#f05bcb" />
              <stop offset="1" stopColor="#f05bcb" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path className="intro__wave intro__wave--1" d="M-100 250 C 300 120, 700 330, 1000 220 S 1400 150, 1540 210" stroke="url(#iw)" strokeWidth="2.5" fill="none" />
          <path className="intro__wave intro__wave--2" d="M-100 280 C 360 170, 760 340, 1060 250 S 1420 200, 1540 250" stroke="url(#iw)" strokeWidth="1.2" fill="none" />
        </svg>
      </div>

      <div className="intro__stage" ref={stageRef} aria-hidden="true">
        <div className="intro__symbol-wrap">
          <span className="intro__halo" />
          <span className="intro__ring intro__ring--1" />
          <span className="intro__ring intro__ring--2" />
          <span className="intro__shock" />
          <svg ref={symbolRef} className="intro__symbol" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="ivs" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
                <stop offset="0.35" stopColor="#fff" stopOpacity="0" />
                <stop offset="0.5" stopColor="#fff" stopOpacity="0.95" />
                <stop offset="0.65" stopColor="#fff" stopOpacity="0" />
                <animateTransform attributeName="gradientTransform" type="translate" from="-1.2 0" to="1.2 0" begin="0.7s" dur="1.1s" repeatCount="2" />
              </linearGradient>
              <linearGradient id="iv" x1="0" y1="0" x2="1" y2="0.4">
                <stop offset="0" stopColor="#7629d9" />
                <stop offset="0.55" stopColor="#c02cc4" />
                <stop offset="1" stopColor="#f05bcb" />
              </linearGradient>
            </defs>
            <path d={V_PATH} fill="url(#iv)" fillRule="evenodd" />
            <path className="intro__shine" d={V_PATH} fill="url(#ivs)" fillRule="evenodd" />
          </svg>
          <span className="intro__flare" />
        </div>
        <span className="intro__divider" />
        <div className="intro__name" ref={nameRef}>
          <span ref={primeRef} className="intro__prime">
            <Letters text="V PRIME" start={0} />
          </span>
          <span ref={proRef} className="intro__pro">
            <Letters text="PRO" start={8} />
          </span>
        </div>
      </div>

      <canvas ref={canvasRef} className="intro__canvas" aria-hidden="true" />
    </div>
  );
}
