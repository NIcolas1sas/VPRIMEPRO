/**
 * ============================================================
 *  V PRIME PRO — CONFIGURAÇÃO CENTRAL
 * ============================================================
 *  Todas as informações comerciais da página ficam aqui.
 *  Altere SOMENTE este arquivo (ou o .env) para atualizar
 *  preços, links de checkout, WhatsApp, dados da empresa etc.
 *
 *  Variáveis de ambiente (arquivo .env na raiz do projeto)
 *  têm prioridade sobre os valores escritos aqui.
 *  Veja o arquivo .env.example.
 * ============================================================
 */

const env = import.meta.env;

export const site = {
  /**
   * demoMode = true  → elementos ainda não confirmados (garantia,
   *                    depoimentos) aparecem com a etiqueta
   *                    "PRÉ-VISUALIZAÇÃO" para revisão interna.
   * demoMode = false → esses elementos ficam OCULTOS até que sejam
   *                    confirmados. Use false ao publicar.
   */
  demoMode: (env.VITE_DEMO_MODE ?? 'true') !== 'false',

  brand: {
    name: 'V PRIME PRO',
    shortName: 'V Prime',
    logo: '/brand/logo.png',
    symbol: '/brand/logo-symbol.png', // símbolo V com fundo transparente
    tagline: 'Filmes, séries, novelas e TV ao vivo em um só lugar',
    description:
      'Filmes, séries, novelas, esportes e mais de 500 canais ao vivo em um só acesso. Plano anual, sem mensalidade e sem fidelidade.',
  },

  seo: {
    title: 'V PRIME PRO | +80 mil conteúdos e +500 canais ao vivo',
    description:
      'Filmes, séries, novelas, esportes e mais de 500 canais ao vivo na Smart TV, no celular, na TV Box ou no computador. Plano anual sem mensalidade e 7 dias de garantia.',
  },

  /** Navegação do cabeçalho e do rodapé (id = âncora da seção) */
  nav: [
    { label: 'Início', id: 'inicio' },
    { label: 'Benefícios', id: 'conteudos' },
    { label: 'Conteúdos', id: 'destaques' },
    { label: 'Compatibilidade', id: 'compatibilidade' },
    { label: 'Planos', id: 'planos' },
    { label: 'Dúvidas', id: 'duvidas' },
  ],

  /**
   * PLANOS
   * - price: valor numérico em reais (usado nos cálculos)
   * - checkoutUrl: link de pagamento. Deixe vazio ('') enquanto não
   *   houver link real — o botão abrirá um aviso de demonstração.
   *   Também pode ser definido via .env (VITE_CHECKOUT_INDIVIDUAL etc.)
   */
  plans: [
    {
      id: 'individual',
      name: 'Individual',
      description: 'Uma tela para assistir do seu jeito.',
      price: 147,
      months: 12,
      screens: 1,
      featured: false,
      badge: '',
      // Checkout Braip — links oficiais de campanha (CPA). Não altere as URLs.
      checkoutUrl: env.VITE_CHECKOUT_INDIVIDUAL || 'https://ev.braip.com/campanhas/cpa/cam91z89o',
    },
    {
      id: 'familia',
      name: 'Família',
      description: 'Duas telas ao mesmo tempo para o casal ou a família.',
      price: 247,
      months: 12,
      screens: 2,
      featured: true,
      badge: 'MAIS ESCOLHIDO',
      checkoutUrl: env.VITE_CHECKOUT_FAMILIA || 'https://ev.braip.com/campanhas/cpa/came0o29l',
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'Três telas para a casa toda assistir junto.',
      price: 327,
      months: 12,
      screens: 3,
      featured: false,
      badge: '',
      checkoutUrl: env.VITE_CHECKOUT_PREMIUM || 'https://ev.braip.com/campanhas/cpa/cam0m2xyk',
    },
  ],

  /**
   * CONTADORES DE CONTEÚDO (seção de planos)
   * Números confirmados pela empresa em 22/11/2026 (novelas contam junto com filmes e séries).
   */
  stats: [
    { icon: 'clapper', value: '+60.000', label: 'Filmes, séries e novelas' },
    { icon: 'live', value: '+500', label: 'Canais ao vivo' },
    { icon: 'layers', value: '+80.000', label: 'Conteúdos no total' },
  ],

  /**
   * Benefícios exibidos nos 3 planos (lista aprovada em 22/11/2026).
   * {telas} é trocado automaticamente pela quantidade de telas do plano.
   */
  planFeatures: [
    'Completo',
    'Sem fidelidade',
    'Assista em {telas}',
    'Mais de 80.000 conteúdos',
    'Canais Adultos (opcional)',
    'Guia de Programação (EPG)',
    'Qualidade SD/HD/FHD/4K',
    'Assista na Smart TV',
    'Assista no Smartphone',
    'Assista na TV Box',
    'Assista no computador',
    'Compatível com todos os sistemas',
  ],

  /**
   * SUPORTE / WHATSAPP
   * Informe apenas números (com DDI e DDD), ex.: 5511999999999
   * Preferencialmente via .env → VITE_WHATSAPP_NUMBER
   */
  support: {
    whatsappNumber: env.VITE_WHATSAPP_NUMBER || '',
    whatsappMessage: 'Olá! Gostaria de saber mais sobre a V PRIME PRO.',
    email: env.VITE_SUPPORT_EMAIL || '',
    hours: env.VITE_SUPPORT_HOURS || '', // ex.: 'Seg a Sáb, das 9h às 18h'
  },

  /**
   * GARANTIA
   * confirmed: mude para true SOMENTE após a empresa confirmar
   * oficialmente a condição de garantia e as regras de reembolso.
   */
  /**
   * COMPATIBILIDADE
   * syncConfirmed: true SOMENTE se a plataforma realmente permitir
   * continuar de onde parou em outro dispositivo.
   */
  compat: {
    syncConfirmed: env.VITE_SYNC_CONFIRMED === 'true',
  },

  guarantee: {
    // Garantia de 7 dias confirmada (copy aprovada em 22/11/2026).
    // Para ocultar a seção: VITE_GUARANTEE_CONFIRMED=false
    confirmed: env.VITE_GUARANTEE_CONFIRMED !== 'false',
    days: 7,
  },

  /**
   * DEPOIMENTOS (carrossel 9:16)
   * Use somente prints REAIS, com autorização dos clientes.
   * Para adicionar: coloque a imagem em public/testimonials/ e inclua
   * uma linha abaixo. Não há limite de quantidade.
   */
  testimonials: [
    { image: '/testimonials/depoimento-01.webp', alt: 'Conversa com cliente no WhatsApp sobre canais de esportes' },
    { image: '/testimonials/depoimento-02.webp', alt: 'Conversa com cliente no WhatsApp sobre a instalação' },
    { image: '/testimonials/depoimento-03.webp', alt: 'Conversa com cliente no WhatsApp sobre controle de canais' },
    { image: '/testimonials/depoimento-04.webp', alt: 'Feedback de cliente no WhatsApp' },
    { image: '/testimonials/depoimento-05.webp', alt: 'Feedback de cliente no WhatsApp sobre qualidade e suporte' },
    { image: '/testimonials/depoimento-06.webp', alt: 'Feedback de cliente no WhatsApp sobre catálogo e atendimento' },
  ],

  /**
   * DADOS DA EMPRESA (rodapé)
   * Preencha com as informações oficiais. Campos vazios não aparecem.
   */
  company: {
    legalName: env.VITE_COMPANY_NAME || '',
    cnpj: env.VITE_COMPANY_CNPJ || '',
    address: env.VITE_COMPANY_ADDRESS || '',
  },

  /**
   * DOCUMENTOS LEGAIS
   * Informe a URL de cada documento. Enquanto estiver vazio,
   * o link abre um aviso de "documento em preparação".
   */
  legal: {
    privacy: env.VITE_URL_PRIVACY || '',
    terms: env.VITE_URL_TERMS || '',
    refund: env.VITE_URL_REFUND || '',
  },

  /**
   * VÍDEOS PROMOCIONAIS (segunda etapa)
   * Coloque os arquivos em /public/videos/ e informe o caminho em `src`
   * (ex.: '/videos/apresentacao.mp4') ou uma URL de embed em `embedUrl`
   * (YouTube/Vimeo). Enquanto ambos estiverem vazios, NADA é renderizado.
   */
  videos: {
    presentation: {
      title: 'Apresentação da V PRIME PRO',
      label: 'APRESENTAÇÃO V PRIME PRO', // texto exibido enquanto não há vídeo
      // VSL no YouTube (tem prioridade sobre src/embedUrl). Thumbnail em public/videos/thumbs/
      youtubeId: env.VITE_YOUTUBE_PRESENTATION || 'Q97EOevF0fs',
      thumb: '/videos/thumbs/vsl-apresentacao.webp',
      src: env.VITE_VIDEO_PRESENTATION || '',
      embedUrl: '', // alternativa: URL de embed do YouTube/Vimeo
      poster: env.VITE_VIDEO_PRESENTATION_POSTER || '', // imagem de capa (opcional)
      controls: true, // mostra os controles nativos após iniciar
      muted: false,
      loop: false,
    },
    sports: {
      title: 'Esportes e futebol na V PRIME PRO',
      label: 'Vídeo de esportes',
      youtubeId: env.VITE_YOUTUBE_SPORTS || 'SGWPM2WwM80',
      thumb: '/videos/thumbs/vsl-esportes.webp',
      noticeText: 'O vídeo de esportes da V PRIME PRO será adicionado em breve.',
      envVar: 'VITE_VIDEO_SPORTS',
      src: env.VITE_VIDEO_SPORTS || '',
      embedUrl: '',
      poster: '',
    },
    /** VSL da seção "Conheça a plataforma" (moldura vazia até configurar) */
    platform: {
      title: 'Filmes e séries na V PRIME PRO',
      youtubeId: env.VITE_YOUTUBE_PLATFORM || 'gVgUNOIMqSk',
      thumb: '/videos/thumbs/vsl-filmes-series.webp',
      src: env.VITE_VIDEO_PLATFORM || '',
      embedUrl: env.VITE_VIDEO_PLATFORM_EMBED || '',
      poster: '',
    },
    catalog: {
      title: 'Catálogo de filmes e séries',
      src: env.VITE_VIDEO_CATALOG || '',
      embedUrl: '',
      poster: '',
    },
  },
};

/* ---------- Helpers derivados da configuração ---------- */

export const formatBRL = (value) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export const whatsappLink = () => {
  const n = site.support.whatsappNumber.replace(/\D/g, '');
  if (!n) return '';
  return `https://wa.me/${n}?text=${encodeURIComponent(site.support.whatsappMessage)}`;
};

export const lowestPlan = () =>
  site.plans.reduce((a, b) => (b.price < a.price ? b : a), site.plans[0]);
