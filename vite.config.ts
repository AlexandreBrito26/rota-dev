import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      manifest: {
        name: 'Rota Dev',
        short_name: 'Rota Dev',
        description: 'Gerador de currículo para desenvolvedores, com tema dia e noite.',
        theme_color: '#0f766e',
        background_color: '#f7f4ee',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        lang: 'pt-BR',
        icons: [
          { src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
          { src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg}'],
      },
      devOptions: { enabled: false },
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: { additionalData: '@use "@/styles/tokens" as *;' },
    },
  },
  resolve: {
    alias: { '@': '/src' },
  },
});
