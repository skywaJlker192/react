import type { NewRequest } from './requests'

// Вебхук n8n «Заявка → Telegram». Токен бота хранится только в n8n.
const NOTIFY_URL = import.meta.env.VITE_NOTIFY_URL ?? 'http://localhost:5678/webhook/zayavka'

export async function notifyAutomation(data: NewRequest): Promise<boolean> {
  try {
    const response = await fetch(NOTIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return response.ok
  } catch {
    return false
  }
}
