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
        // stays cached across the frequent docs deploys. `advancedChunks`
        // (Rolldown-native) groups strictly by module id, so — unlike the
        // older `manualChunks` callback — it never co-locates first-party code
        // with a vendor group and tangles the react/framer-motion graph onto
        // the initial critical path.
        advancedChunks: {
          groups: [
            { name: 'react', test: /[\\/]node_modules[\\/](react|react-dom|scheduler|use-sync-external-store)[\\/]/ },
            { name: 'motion', test: /[\\/]node_modules[\\/](framer-motion|motion-dom|motion-utils)[\\/]/ },
          ],
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
