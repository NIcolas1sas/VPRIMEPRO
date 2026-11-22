/**
 * ============================================================
 *  COMPARAÇÃO DE ASSINATURAS — preços centralizados
 * ============================================================
 *  ATENÇÃO antes de publicar:
 *  1. Confira cada preço no site oficial da plataforma (plano
 *     mensal com 2 telas simultâneas).
 *  2. Preencha `checkedAt` com a data da consulta (ex.: '11/2026').
 *     Com demoMode desligado, a seção só aparece quando checkedAt
 *     estiver preenchido.
 *  3. logo: deixe null (mostra a inicial) ou aponte para o arquivo
 *     oficial da marca em /public/logos/ — use somente se as regras
 *     de uso da marca permitirem publicidade comparativa.
 *
 *  Os valores abaixo vieram da imagem de referência e AINDA NÃO
 *  foram validados.
 * ============================================================
 */
export const comparison = {
  checkedAt: '', // ex.: '11/2026'
  planId: 'familia', // plano V PRIME PRO usado na comparação (2 telas)
  screensLabel: '2 telas',
  platforms: [
    { id: 'netflix', name: 'Netflix', monthly: 25.9, logo: null },
    { id: 'disney', name: 'Disney+', monthly: 29.9, logo: null },
    { id: 'hbomax', name: 'HBO Max', monthly: 29.9, logo: null },
    { id: 'globoplay', name: 'Globoplay', monthly: 29.9, logo: null },
    { id: 'primevideo', name: 'Prime Video', monthly: 19.9, logo: null },
    { id: 'appletv', name: 'Apple TV+', monthly: 34.9, logo: null },
    { id: 'paramount', name: 'Paramount+', monthly: 34.9, logo: null },
    { id: 'crunchyroll', name: 'Crunchyroll', monthly: 19.9, logo: null },
  ],
};
