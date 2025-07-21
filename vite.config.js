import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          'wallet-vendor': ['@rainbow-me/rainbowkit', 'wagmi', 'viem'],
          'ui-vendor': ['framer-motion', 'lucide-react']
        }
      }
    }
  },
  server: {
    port: 3000,
    host: true
  }
})