import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import https from "https";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: true,
    proxy: {
      '/api/quotable': {
        target: 'https://api.quotable.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/quotable/, ''),
        secure: false,
        agent: new https.Agent({ rejectUnauthorized: false })
      },
      '/api/quotes': {
        target: 'https://api.forismatic.com/api/1.0/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/quotes/, ''),
        secure: false,
        agent: new https.Agent({ rejectUnauthorized: false })
      }
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
});
