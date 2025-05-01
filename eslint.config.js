import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: ['server/generated/**'],
  formatters: true,
  vue: true,
  typescript: true,
})
