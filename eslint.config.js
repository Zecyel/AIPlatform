// @ts-check
import antfu from '@antfu/eslint-config'
import nuxt from './.nuxt/eslint.config.mjs'

export default nuxt(antfu({
  typescript: true,
  vue: true,

  stylistic: {
    indent: 2,
    quotes: 'single',
    semi: false,
  },
}))
