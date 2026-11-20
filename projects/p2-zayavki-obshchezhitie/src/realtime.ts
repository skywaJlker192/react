import { pb } from './pb'
import type { RequestItem } from './requests'

export type RequestEvent = {
  action: string
  record: RequestItem
}

// Живые обновления из PocketBase: доска реагирует на изменения
// даже если заявку поменял бот или другой открытый браузер.
export function watchRequests(onEvent: (event: RequestEvent) => void): () => void {
  const pending = pb.collection('obshchezhitie').subscribe<RequestItem>('*', onEvent)
  return () => {
    pending.then((unsubscribe) => unsubscribe())
  }
}
