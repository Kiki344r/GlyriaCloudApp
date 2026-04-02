export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@nuxt/eslint',
    '@nuxt/image',
    '@pinia/nuxt'
  ],

  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  srcDir: 'src/',

  css: ['~/assets/css/main.css'],

  ui: {
    colorMode: false
  },
  runtimeConfig: {
    public: {
      api_url: ''
    }
  },

    ssr: false,
    vite: {
      fs: { allow: ['..'] }, // Autorise l'accès aux node_modules
      allowedHosts: [
        'cloud.glyria.app'
      ],
      // Meilleur compatibilité pour la sortie "Tauri CLI"
      clearScreen: false,
      // Activez les variables d'environnement
      // Vous pouvez trouver les variables d'environnements additionnelles sur
      // https://v2.tauri.app/reference/environment-variables/
      envPrefix: ['VITE_', 'TAURI_'],
      server: {
        // Tauri requiert un port constant
        strictPort: true,
        // Active le serveur de développement pour être visible par les autres appareils pour le développement mobile
        // @ts-ignore
        host: '0.0.0.0',
        hmr: {
          // Utilisez le websocket pour le rechargement à chaud

          protocol: 'ws',
          // Assurez-vous que ce soit disponible sur le réseau
          host: '0.0.0.0',
          // Utilisez un port spécifique pour hmr
          port: 5183,
        },
      },
    },
  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
