/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Legacy plugin desabilitado temporariamente devido a incompatibilidade com BigInt
    // Reativar quando necessário para suporte a navegadores antigos
    // legacy({
    //   targets: ['chrome >= 67', 'firefox >= 68', 'safari >= 14', 'edge >= 79'],
    //   modernPolyfills: true,
    //   renderLegacyChunks: true,
    // })
  ],
  build: {
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      ecma: 2020,
      parse: {
        ecma: 2020,
      },
      compress: {
        ecma: 2020,
      },
      output: {
        ecma: 2020,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar bibliotecas grandes em chunks próprios
          'vendor-react': ['react', 'react-dom', 'react-router', 'react-router-dom'],
          'vendor-ionic': ['@ionic/react', '@ionic/react-router'],
          'vendor-firebase': ['firebase/app', 'firebase/firestore', 'firebase/auth'],
          'vendor-mapbox': ['mapbox-gl'],
          'vendor-forms': ['react-hook-form', '@hookform/resolvers', 'zod'],
          'vendor-supabase': ['@supabase/supabase-js'],
        },
      },
    },
    chunkSizeWarningLimit: 2000, // Limite de 2MB (Mapbox é uma biblioteca grande)
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  }
})
