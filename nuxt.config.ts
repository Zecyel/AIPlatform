import { env } from './server/utils/environment'

// https://nuxt.com/docs/api/configuration/nuxt-config
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
    uri: env.MONGODB_URI,
    options: {
      dbName: env.MONGO_DB,
    },
    modelsDir: 'server/models',
  },
  runtimeConfig: {
    private: {
      JWT: env.JWT_SECRET,
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