/**
 * ============================================================
 *  CATÁLOGO — configuração da seção 02 (carrosséis de capas)
 * ============================================================
 *  Para trocar as capas:
 *   1. Coloque as imagens em  public/catalog/  (ex.: capa-01.webp)
 *      Proporção recomendada: 2:3 (ex.: 500x750 px), WebP ou JPG.
 *   2. Em cada item, informe  src: '/catalog/capa-01.webp'  e  title.
 *  Itens sem `src` usam uma capa ilustrativa (SVG) própria da V PRIME PRO.
 *
 *  Use somente imagens que a empresa tenha direito de utilizar
 *  em publicidade (arte licenciada ou produzida pela própria marca).
 * ============================================================
 */

const env = import.meta.env;

export const catalog = {
  /**
   * Número exibido na headline. Use somente se confirmado pela empresa.
   * countConfirmed = false → em demoMode aparece com etiqueta de
   * pré-visualização; com demoMode = false a headline usa o texto
   * alternativo (sem número).
   */
  count: '80 MIL',
  countConfirmed: env.VITE_CATALOG_COUNT_CONFIRMED !== 'false', // +80.000 confirmado em 22/11/2026,

  /** Ajustes visuais dos carrosséis (valores em px) */
  layout: {
    posterWidth: { desktop: 190, tablet: 158, mobile: 118 },
    gap: { desktop: 18, tablet: 14, mobile: 10 },
  },

  /**
   * Carrosséis. speed = pixels por segundo (movimento moderado: 25–45).
   * direction: 'right' | 'left'
   */
  rows: [
    {
      id: 'row-1',
      label: 'Destaques do catálogo',
      direction: 'right',
      speed: 42,
      items: [
       { title: 'Dark', src: '/catalog/capa-01.webp' },
      { title: 'stranger things', src: '/catalog/capa-02.webp' },
        { title: 'loki', src: '/catalog/capa-03.webp' },
        { title: 'champions l;eague', src: '/catalog/capa-04.webp' },
        { title: 'libertadores', src: '/catalog/capa-05.webp' },
        { title: 'the walking dead', src: '/catalog/capa-06.webp' },
        { title: 'tulsa king', src: '/catalog/capa-07.webp' },
        { title: 'peaky blinders', src: '/catalog/capa-08.webp' },
        { title: 'valoses furiosos', src: '/catalog/capa-09.webp' },
        { title: 'a grnade imundacao', src: '/catalog/capa-10.webp' },
      ],
    },
    {
      id: 'row-2',
      label: 'Mais para assistir',
      direction: 'left',
      speed: 42,
      // tone/flip variam as artes ilustrativas para nenhuma capa se repetir
      items: [
        { title: 'os donos do jogo', src: '/catalog/capa-11.webp' },
        { title: 'bridgerton', src: '/catalog/capa-12.webp' },
        { title: 'brasileirao', src: '/catalog/capa-13.webp' },
        { title: 'the mentalist', src: '/catalog/capa-14.webp' },
        { title: 'homen aranha', src: '/catalog/capa-15.webp' },
        { title: 'a odisseia', src: '/catalog/capa-16.webp' },
        { title: 'outer banks', src: '/catalog/capa-17.webp' },
        { title: 'greys anatomy', src: '/catalog/capa-18.webp' },
        { title: 'reacher', src: '/catalog/capa-19.webp' },
        { title: 'deedpool', src: '/catalog/capa-20.webp' },
      ],
    },
  ],

  /** Faixa de categorias abaixo dos carrosséis */
  categories: [
    { icon: 'film', label: 'Filmes e Séries' },
    { icon: 'tv', label: 'Canais de TV' },
    { icon: 'ball', label: 'Esportes' },
    { icon: 'mask', label: 'Novelas' },
    { icon: 'smile', label: 'Infantil' },
    { icon: 'grid', label: 'E muito mais' },
  ],
};
