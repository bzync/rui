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
  build: {
    rollupOptions: {
      output: {
        // Split rarely-changing vendor code into its own hashed chunks so it
        // stays cached across the frequent docs deploys, instead of being
        // folded into a catch-all chunk named after the preload helper.
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (/[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) return 'react'
          if (id.includes('framer-motion') || id.includes('motion-dom') || id.includes('motion-utils')) return 'motion'
        },
      },
    },
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
