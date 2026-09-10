import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Netlify/Vercel: base '/'  |  GitHub Pages: set VITE_GH_PAGES=1 or pass --base
const isGhPages = process.env.VITE_GH_PAGES === '1' || process.env.GITHUB_PAGES === 'true'

export default defineConfig({
  base: isGhPages ? '/desko/' : '/',
  plugins: [react()],
})
