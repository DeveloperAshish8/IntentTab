import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        newtab: resolve(__dirname, 'newtab.html'),
        popup: resolve(__dirname, 'popup.html'),
        background: resolve(__dirname, 'src/background/serviceWorker.js'),
        content: resolve(__dirname, 'src/content/intentOverlay.jsx'),
        tabIntentTitle: resolve(__dirname, 'src/content/tabIntentTitle.js')
      },
      output: {
        entryFileNames: (assetInfo) => {
          if (['background', 'content', 'tabIntentTitle'].includes(assetInfo.name)) {
            return '[name].js';
          }
          return 'assets/[name]-[hash].js';
        }
      }
    }
  }
})
