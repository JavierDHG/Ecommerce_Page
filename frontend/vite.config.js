import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: true,     // ← Esto permite que el contenedor acepte conexiones externas
    port: 5174,     // ← Forzamos el puerto que Docker va a exponer
  },
})
