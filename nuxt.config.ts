export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  extends: ['@nuxt/ui-pro'],
  modules: [
    '@nuxt/content',
    'nuxt-mongoose',
    '@nuxt/ui',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    '@nuxt/eslint',
    '@nuxtjs/mdc',
  ],
  mongoose: {
    uri: process.env.MONGO_URI,
    options: {
      dbName: 'aiplatform',
    },
    modelsDir: 'server/models',
  },
  runtimeConfig: {
    private: {
      jwtSecret: (process.env.JWT_SECRET || 'Hard to Guess String') as string,
    },
  },
  ssr: true,
  pinia: {
    storesDirs: ['./store/**'],
  },
  piniaPersistedstate: {
    storage: 'cookies',
  },
  build: {
    transpile: ['trpc-nuxt'],
  },
  eslint: {
    config: {
      standalone: false,
    },
  },
})
