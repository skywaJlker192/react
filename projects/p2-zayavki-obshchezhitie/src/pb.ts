import PocketBase from 'pocketbase'

// Адрес базы можно переопределить через VITE_PB_URL в файле .env
export const PB_URL = import.meta.env.VITE_PB_URL ?? 'http://localhost:8090'

export const pb = new PocketBase(PB_URL)
