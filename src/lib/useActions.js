import { useCallback } from 'react';
import { site, whatsappLink, formatBRL } from '../config/site.js';
import { useNotice } from '../components/ui/Notice.jsx';

/** Ações comerciais centralizadas: checkout, suporte e documentos. */
export default function useActions() {
  const notice = useNotice();

  const checkout = useCallback(
    (plan) => {
      if (plan.checkoutUrl) {
        window.open(plan.checkoutUrl, '_blank', 'noopener');
        return;
      }
      notice({
        title: `Plano ${plan.name} — ${formatBRL(plan.price)}`,
        text: 'O link de pagamento deste plano ainda não foi configurado. Nenhuma compra foi realizada e nenhum dado foi coletado.',
        detail: 'Para ativar: informe o link de checkout em src/config/site.js (campo checkoutUrl) ou no arquivo .env.',
      });
    },
    [notice]
  );

  const support = useCallback(() => {
    const link = whatsappLink();
    if (link) {
      window.open(link, '_blank', 'noopener');
      return;
    }
    notice({
      title: 'Canal de suporte em configuração',
      text: 'O número oficial de atendimento ainda não foi configurado nesta página.',
      detail: 'Para ativar: defina VITE_WHATSAPP_NUMBER no arquivo .env (somente números, com DDI e DDD).',
    });
  }, [notice]);

  const legal = useCallback(
    (key, label) => {
      const url = site.legal[key];
      if (url) {
        window.open(url, '_blank', 'noopener');
        return;
      }
      notice({
        title: label,
        text: 'Este documento está em preparação e será publicado pela empresa em breve.',
        detail: 'Para ativar: informe a URL do documento em src/config/site.js → legal.',
      });
    },
    [notice]
  );

  return { checkout, support, legal };
}
