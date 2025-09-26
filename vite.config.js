import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',   // 👈 allow external connections
    port: 5173,        // 👈 keep the same port
    allowedHosts: [        // 👈 put this here
      '.ngrok-free.app',
      '.ngrok-free.dev',
    ],
  },
})