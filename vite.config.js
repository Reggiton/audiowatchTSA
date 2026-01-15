import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'

// @config Vite build configuration
// Configures the development server, build output, and module resolution
// https://vite.dev/config/
export default defineConfig({
  logLevel: 'error', // Suppress warnings, only show errors
  plugins: [
    react(),
  ],
  // @alias Path resolution configuration
  // Allows '@/...' imports to resolve to './src/...'
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  // @server Development server settings
  server: {
    port: 3000,
    open: true
  },
  // @build Production build configuration
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
