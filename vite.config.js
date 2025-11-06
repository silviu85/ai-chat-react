// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Absolutely necessary for Docker
    port: 5173,
    // This tells Vite's Hot Module Replacement (HMR) client
    // how to connect back to the server.
    hmr: {
      clientPort: 8080, // It should connect via the Nginx port
    },
    watch: {
      usePolling: true,
    }
  }
});