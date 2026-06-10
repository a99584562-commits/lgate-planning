import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' — относительные пути ассетов, чтобы билд работал и локально,
// и с подпути GitHub Pages.
export default defineConfig({
  base: './',
  plugins: [react()],
  server: { port: 5197, host: true },
})
