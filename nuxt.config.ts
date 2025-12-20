// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  
  modules: [
    '@nuxtjs/tailwindcss',
  ],

  css: [
    '~/assets/css/main.css',
    'ant-design-vue/dist/reset.css'
  ],

  vite: {
    resolve: {
      alias: {
        '@ant-design/icons-vue': '@ant-design/icons-vue',
      },
    },
    optimizeDeps: {
      include: ['ant-design-vue', '@ant-design/icons-vue']
    },
    server: {
      hmr: {
        overlay: false
      }
    }
  },

  runtimeConfig: {
    // Private keys (only available on server-side)
    firebaseAdminKey: process.env.FIREBASE_ADMIN_KEY,
    firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
    
    // Public keys (exposed to client-side)
    public: {
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.FIREBASE_APP_ID,
      firebaseMeasurementId: process.env.FIREBASE_MEASUREMENT_ID,
    }
  },

  app: {
    head: {
      title: 'Roseli - Sport & Aventură pentru Copii',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Activități sportive și de aventură pentru copii: tabere, drumeții, excursii, lecții de ski și înot în Brașov, România' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'apple-touch-icon', href: '/favicon.png' }
      ]
    }
  }
})

