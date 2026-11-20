import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Сайт лежит в подпапке с именем репозитория: https://<логин>.github.io/monitoring/
  base: '/monitoring/',
  // host и allowedHosts — чтобы дев-сервер открывался и с других устройств,
  // и из онлайн-песочницы (на сборку и GitHub Pages не влияют).
  server: { host: true, allowedHosts: true },
  preview: { host: true, allowedHosts: true },
})
