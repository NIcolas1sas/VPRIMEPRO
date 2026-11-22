import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // No Windows, o observador nativo pode encerrar o servidor (EBUSY)
    // ao criar/apagar arquivos. A checagem periódica evita isso.
    watch: { usePolling: true, interval: 300 },
  },
});
