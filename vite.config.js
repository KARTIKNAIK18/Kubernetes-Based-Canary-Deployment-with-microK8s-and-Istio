import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',       // Production build folder
    assetsDir: 'assets',  // Folder for JS/CSS/images
  },
  base: './',             // Ensures assets load correctly in container/Ingress
  server: {
    host: '0.0.0.0',      // Accessible from any IP (required for container/K8s)
    port: 5173,            // Dev server port
  },
})

