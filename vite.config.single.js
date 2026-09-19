import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// Builds the whole site into one self-contained HTML file (JS, CSS and images
// inlined) that works when opened straight from disk. Output: dist-html/index.html
export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile()],
  base: './',
  build: {
    outDir: 'dist-html',
    assetsInlineLimit: 100_000_000,
  },
})
