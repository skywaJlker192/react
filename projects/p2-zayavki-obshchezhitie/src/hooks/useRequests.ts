import { useEffect, useState } from 'react'
import { dropRequest, insertRequest, loadRequests, patchStatus } from '../api'
import { watchRequests } from '../realtime'
import { advanceStatus, mergeRequest, type NewRequest, type RequestItem, type Status } from '../requests'

export function useRequests() {
  const [requests, setRequests] = useState<RequestItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  // Первичная загрузка + повтор по кнопке «Повторить».
  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const list = await loadRequests()
        if (!cancelled) {
          setRequests(list)
        }
      } catch (e) {
        if (!cancelled) {
          setError((e as Error).message)
        }
      }
      if (!cancelled) {
        setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [reloadKey])

  // Подписка на события базы — доска обновляется сама.
  useEffect(() => {
    return watchRequests(({ action, record }) => {
      if (action === 'delete') {
        setRequests((list) => list.filter((r) => r.id !== record.id))
      } else {
        setRequests((list) => mergeRequest(list, record))
      }
    })
  }, [])

  function retry() {
    setError('')
    setLoading(true)
    setReloadKey((key) => key + 1)
  }

  async function add(data: NewRequest): Promise<RequestItem> {
    const created = await insertRequest(data)
    setRequests((list) => mergeRequest(list, created))
    return created
  }

  async function advance(id: string, status: Status) {
    const updated = await patchStatus(id, advanceStatus(status))
    setRequests((list) => mergeRequest(list, updated))
  }

  async function remove(id: string) {
    await dropRequest(id)
    setRequests((list) => list.filter((r) => r.id !== id))
  }

  return { requests, loading, error, retry, add, advance, remove }
}
