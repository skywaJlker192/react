import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Дев-сервер поднимается на http://localhost:5173 —
// этот адрес разрешён в CORS вебхука n8n.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
})
