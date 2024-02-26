import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  //to work with Docker
  server: {
    host: true,
    port: 8000
  }
})
