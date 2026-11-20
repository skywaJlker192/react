import { pb } from './pb'
import type { Ticket } from '../types'

export type TicketEvent = {
  action: string
  record: Ticket
}

// Живые обновления из PocketBase: доска реагирует на изменения
// даже если заявку поменял бот или другой открытый браузер.
export function watchTickets(onEvent: (event: TicketEvent) => void): () => void {
  const subscription = pb.collection('zayavki').subscribe<Ticket>('*', onEvent)
  return () => {
    subscription.then((unsubscribe) => unsubscribe())
  }
}
