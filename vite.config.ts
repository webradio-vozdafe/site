import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

function suppressViteWebsocketErrors() {
  return {
    name: 'suppress-vite-websocket-errors',
    transformIndexHtml: {
      order: 'pre' as const,
      handler(html: string) {
        const suppressScript = `<script>
(function() {
  var origConsoleError = console.error;
  console.error = function() {
    var fullText = '';
    for (var i = 0; i < arguments.length; i++) {
      var arg = arguments[i];
      if (typeof arg === 'string') {
        fullText += ' ' + arg;
      } else if (arg && typeof arg === 'object') {
        fullText += ' ' + (arg.message || '') + ' ' + (arg.stack || '') + ' ' + String(arg);
      } else {
        fullText += ' ' + String(arg);
      }
    }
    if (
      fullText.includes('WebSocket') ||
      fullText.includes('websocket') ||
      fullText.includes('closed without opened') ||
      fullText.includes('vite:ws') ||
      fullText.includes('vite-hmr')
    ) {
      return;
    }
    origConsoleError.apply(console, arguments);
  };
})();
</script>`;
        return html.replace('<head>', '<head>\n' + suppressScript);
      }
    }
  };
}

export default defineConfig({
  plugins: [
    suppressViteWebsocketErrors(),
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifestFilename: 'manifest.json',
      includeAssets: [
        'favicon.ico',
        'favicon.png',
        'apple-touch-icon.png',
        'pwa-192x192.png',
        'pwa-512x512.png',
        'pwa-maskable-512x512.png'
      ],
      manifest: {
        id: '/',
        name: 'Rádio Vóz da Fé',
        short_name: 'Vóz da Fé',
        description: 'Transmissão 24 horas da Rádio Vóz da Fé — louvores, mensagens bíblicas e devocionais que edificam.',
        theme_color: '#102b28',
        background_color: '#102b28',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        orientation: 'portrait',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/pwa-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,ico,png,svg,woff,woff2}'],
        globIgnores: ['**/index.html', 'index.html'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api/],
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'app-pages-cache',
              networkTimeoutSeconds: 3,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: ({ url }) => url.origin === self.location.origin && !url.pathname.startsWith('/api/'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'app-routes-cache',
              networkTimeoutSeconds: 3,
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
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
        type: 'module',
        suppressWarnings: true
      }
    })
  ],
  base: '/',
  server: {
    host: '0.0.0.0',
    port: 3000,
    hmr: false,
  },
});
