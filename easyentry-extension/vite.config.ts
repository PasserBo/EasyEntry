import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Use relative paths for Chrome extension
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        sidepanel: resolve(__dirname, 'src/sidepanel.tsx'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'sidepanel') {
            return 'assets/sidepanel.js';
          }
          return 'assets/[name].js';
        },
        chunkFileNames: 'assets/[name].js',
        assetFileNames: (assetInfo) => {
          // Ensure CSS files have consistent naming
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'assets/[name].[ext]';
          }
          return 'assets/[name].[ext]';
        }
      }
    },
    // Ensure CSS is extracted
    cssCodeSplit: false,
    outDir: 'dist',
    assetsDir: 'assets',
  },
  publicDir: 'public',
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
