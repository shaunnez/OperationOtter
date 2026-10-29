import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { secretContent } from './vite-plugin-secret.ts'

export default defineConfig({
  // GitHub Pages serves the site under /<repo>/; the deploy workflow sets BASE_PATH
  base: process.env.BASE_PATH || '/',
  plugins: [react(), secretContent()],
  build: {
    sourcemap: false,
    assetsInlineLimit: 0,
  },
  test: {
    environment: 'node',
    include: ['tests/unit/**/*.test.ts'],
  },
})
