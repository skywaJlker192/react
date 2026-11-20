import { PB_URL } from './pb'
import type { NewRequest, RequestItem, Status } from './requests'
const API_URL = `${PB_URL}/api/collections/obshchezhitie/records`
const JSON_HEADERS = { 'Content-Type': 'application/json' }

async function request(url: string, init?: RequestInit): Promise<Response> {
  let response: Response
  try {
    response = await fetch(url, init)
  } catch {
    throw new Error('PocketBase не отвечает. Поднимите базу командой docker compose up -d.')
  }
  if (!response.ok) {
    throw new Error(`База отклонила запрос (код ${response.status}). Проверьте коллекцию «obshchezhitie» и правила доступа.`)
  }
  return response
}

export async function loadRequests(): Promise<RequestItem[]> {
  const response = await request(`${API_URL}?perPage=200&sort=-created`)
  const page = await response.json()
  return page.items
}

export async function insertRequest(data: NewRequest): Promise<RequestItem> {
  const response = await request(API_URL, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ ...data, status: 'Новая' }),
  })
  return response.json()
}

export async function patchStatus(id: string, status: Status): Promise<RequestItem> {
  const response = await request(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: JSON_HEADERS,
    body: JSON.stringify({ status }),
  })
  return response.json()
}

export async function dropRequest(id: string): Promise<void> {
  await request(`${API_URL}/${id}`, { method: 'DELETE' })
}
