import { defineConfig } from 'tsdown/config'

export default defineConfig({
  entry: 'index.ts',
  dts: true,
  shims: true,
})
