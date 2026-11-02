import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.ico',
        'apple-touch-icon.png',
        'assets/aistudio/Logotipo_Dourado_Voz_da_F__4a6f8aec.png'
      ],
      manifest: {
        id: '/inicio',
        name: 'Rádio Vóz da Fé',
        short_name: 'Vóz da Fé',
        description: 'Transmissão 24 horas da Rádio Vóz da Fé — louvores, mensagens bíblicas e devocionais que edificam.',
        theme_color: '#102b28',
        background_color: '#102b28',
        display: 'standalone',
        start_url: './inicio',
        scope: './',
        orientation: 'portrait',
        icons: [
          {
            src: './assets/aistudio/Logotipo_Dourado_Voz_da_F__4a6f8aec.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: './assets/aistudio/Logotipo_Dourado_Voz_da_F__4a6f8aec.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: './assets/aistudio/Logotipo_Dourado_Voz_da_F__4a6f8aec.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: true,
        type: 'module'
      }
    })
  ],
  base: './',
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
});
