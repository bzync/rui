import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    include: [
      'prettier/standalone',
      'prettier/plugins/babel',
      'prettier/plugins/estree',
    ],
  },
  server: {
    fs: {
      allow: [fileURLToPath(new URL('..', import.meta.url))],
    },
  },
  resolve: {
    alias: [
      {
        find: '@bzync/rui/styles.css',
        replacement: fileURLToPath(new URL('../dist/styles.css', import.meta.url)),
      },
      {
        find: '@bzync/rui',
        replacement: fileURLToPath(new URL('../dist/index.js', import.meta.url)),
      },
    ],
    dedupe: ['react', 'react-dom', 'framer-motion'],
  },
})
