/**
 * ============================================================
 *  SEÇÃO 03 — "Tudo o que você encontra na V PRIME PRO"
 * ============================================================
 *  Cada card: imagem (public/features/), posição da imagem,
 *  ícone, título em duas linhas (accent = magenta) e descrição.
 *
 *  confirmKey: o card depende de uma informação ainda não
 *  confirmada pela empresa. Enquanto não confirmada:
 *   - demoMode = true  → aparece com a etiqueta "a confirmar";
 *   - demoMode = false → usa `fallback` (se houver) ou fica oculto.
 * ============================================================
 */

const env = import.meta.env;

export const featureConfirmations = {
  filmsCount: env.VITE_FILMS_COUNT_CONFIRMED === 'true', // "+50.000 filmes"
  adultPin: env.VITE_ADULT_PIN_CONFIRMED === 'true', // proteção por senha na categoria adulta
};

export const features = [
  {
    id: 'esportes',
    image: '/features/esportes-ao-vivo.webp',
    imagePosition: '78% 30%',
    icon: 'ball',
    lines: [{ text: 'Esportes' }, { text: 'ao vivo', accent: true }],
    text: 'Futebol, basquete e outros eventos esportivos transmitidos ao vivo, para você ver o lance na hora em que ele acontece.',
  },
  {
    id: 'filmes',
    image: '/features/filmes.webp',
    imagePosition: '85% 50%',
    icon: 'clapper',
    lines: [{ text: '+60.000', accent: true }, { text: 'Filmes e séries' }],
    text: 'Ação, comédia, drama, suspense e animação. Lançamentos e clássicos para escolher sem pressa, do sofá de casa.',
    fallback: { lines: [{ text: 'Catálogo de' }, { text: 'Filmes', accent: true }] },
  },
  {
    id: 'canais',
    image: '/features/canais-brasileiros.webp',
    imagePosition: '88% 45%',
    icon: 'tv',
    lines: [{ text: 'Canais' }, { text: 'brasileiros', accent: true }],
    text: 'Canais abertos e fechados do Brasil, com guia de programação para saber o que está passando agora.',
  },
  {
    id: 'adulto',
    image: '/features/conteudo-adulto.webp',
    imagePosition: '45% 50%',
    icon: '18+',
    lines: [{ text: 'Conteúdo adulto' }, { text: 'em HD', accent: true }],
    text: 'Categoria exclusiva para maiores de 18 anos, opcional e separada do restante do catálogo.',
  },
  {
    id: 'senha',
    image: '/features/protecao-senha.webp',
    imagePosition: '52% 50%',
    icon: 'lock',
    lines: [{ text: 'Conteúdo adulto' }, { text: 'protegido por senha', accent: true }],
    text: 'A categoria adulta fica trancada por senha. Crianças e visitas navegam pelo resto do catálogo sem ver esse conteúdo.',
    confirmKey: 'adultPin',
  },
  {
    id: 'smart-tv',
    image: '/features/smart-tv.webp',
    imagePosition: '90% 45%',
    icon: 'monitor',
    lines: [{ text: 'Compatível com' }, { text: 'Smart TV', accent: true }],
    text: 'Instale na Smart TV e assista na tela grande da sala. Também funciona em TV Box, celular e computador.',
  },
];
