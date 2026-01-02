// https://nuxt.com/docs/api/configuration/nuxt-config
// @ts-ignore - defineNuxtConfig is auto-imported by Nuxt
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
    // Firebase Admin SDK credentials (alternative to FIREBASE_ADMIN_KEY)
    firebaseClientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    firebasePrivateKey: process.env.FIREBASE_PRIVATE_KEY,
    
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
      title: 'Roseli - Sport & Aventură pentru Copii | Tabere, Drumeții, Lecții de Ski și Înot',
      titleTemplate: '%s | Roseli',
      htmlAttrs: {
        lang: 'ro'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes' },
        { name: 'description', content: 'Activități sportive și de aventură pentru copii: tabere, drumeții, excursii, lecții de ski și înot în Brașov, România. Oferim experiențe unice de sport și aventură pentru copii.' },
        { name: 'keywords', content: 'tabere copii, drumeții copii, lecții ski copii, lecții înot copii, activități copii Brașov, afterschool Brașov, excursii educaționale, sport copii România' },
        { name: 'author', content: 'Roseli - Sport & Aventură pentru Copii' },
        { name: 'robots', content: 'index, follow' },
        { name: 'googlebot', content: 'index, follow' },
        
        // Open Graph / Facebook
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://activitati-copii-roseli.ro' },
        { property: 'og:title', content: 'Roseli - Sport & Aventură pentru Copii' },
        { property: 'og:description', content: 'Activități sportive și de aventură pentru copii: tabere, drumeții, excursii, lecții de ski și înot în Brașov, România' },
        { property: 'og:image', content: 'https://activitati-copii-roseli.ro/favicon.png' },
        { property: 'og:locale', content: 'ro_RO' },
        { property: 'og:site_name', content: 'Roseli - Sport & Aventură pentru Copii' },
        
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:url', content: 'https://activitati-copii-roseli.ro' },
        { name: 'twitter:title', content: 'Roseli - Sport & Aventură pentru Copii' },
        { name: 'twitter:description', content: 'Activități sportive și de aventură pentru copii: tabere, drumeții, excursii, lecții de ski și înot în Brașov, România' },
        { name: 'twitter:image', content: 'https://activitati-copii-roseli.ro/favicon.png' },
        
        // Additional SEO
        { name: 'theme-color', content: '#1890ff' },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'apple-touch-icon', href: '/favicon.png' },
        { rel: 'canonical', href: 'https://activitati-copii-roseli.ro' }
      ],
      script: [
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Roseli - Sport & Aventură pentru Copii',
            url: 'https://activitati-copii-roseli.ro',
            logo: 'https://activitati-copii-roseli.ro/favicon.png',
            description: 'Activități sportive și de aventură pentru copii: tabere, drumeții, excursii, lecții de ski și înot în Brașov, România',
            address: {
              '@type': 'PostalAddress',
              addressCountry: 'RO',
              addressRegion: 'Brașov'
            },
            contactPoint: {
              '@type': 'ContactPoint',
              telephone: '+40-732-919-429',
              contactType: 'customer service',
              areaServed: 'RO',
              availableLanguage: 'Romanian'
            },
            sameAs: [
              'https://www.facebook.com/roselisportsiaventura/'
            ]
          })
        },
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Roseli - Sport & Aventură pentru Copii',
            url: 'https://activitati-copii-roseli.ro',
            potentialAction: {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: 'https://activitati-copii-roseli.ro/activities?search={search_term_string}'
              },
              'query-input': 'required name=search_term_string'
            }
          })
        }
      ]
    }
  }
})

