import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,              // enable global test APIs like `test`, `expect`
    environment: 'jsdom',       // simulate browser environment
    setupFiles: './src/setupTests.js', // optional setup file
  }
})
