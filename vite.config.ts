import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'https://visualnet.letsinove.com',
  //       changeOrigin: true,
  //       secure: false,
  //       rewrite: (path) => path.replace(/^\/api/, ''),
  //       configure: (proxy) => {
  //         proxy.on('proxyReq', (proxyReq) => {
  //           proxyReq.setHeader('Origin', 'http://localhost:5173');
  //         });
  //       }
  //     }
  //   }
  // }
})
