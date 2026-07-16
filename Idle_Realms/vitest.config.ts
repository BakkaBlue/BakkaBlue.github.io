import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  base: '/Idle_Realms/',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  test: {
    include: ['src/**/*.test.ts'],
  },
})
