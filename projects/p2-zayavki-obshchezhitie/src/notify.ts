import type { RequestItem } from './requests'

// Вебхук n8n: заявка уходит диспетчеру, который пишет в Telegram.
const NOTIFY_URL = import.meta.env.VITE_NOTIFY_URL ?? 'http://localhost:5678/webhook/novaya-zayavka'

export async function notifyAutomation(item: RequestItem): Promise<boolean> {
  try {
    const response = await fetch(NOTIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    })
    return response.ok
  } catch {
    return false
  }
}
