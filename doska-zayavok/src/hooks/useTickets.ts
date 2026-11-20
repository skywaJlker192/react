import { useEffect, useState } from 'react'
import { dropTicket, insertTicket, loadTickets, patchStatus } from '../lib/api'
import { watchTickets } from '../lib/realtime'
import { advanceStatus, mergeTicket, type NewTicket, type Status, type Ticket } from '../types'

export function useTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  // Первичная загрузка + повтор по кнопке «Попробовать снова».
  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const list = await loadTickets()
        if (!cancelled) {
          setTickets(list)
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
    return watchTickets(({ action, record }) => {
      if (action === 'delete') {
        setTickets((list) => list.filter((t) => t.id !== record.id))
      } else {
        setTickets((list) => mergeTicket(list, record))
      }
    })
  }, [])

  function retry() {
    setError('')
    setLoading(true)
    setReloadKey((key) => key + 1)
  }

  async function add(data: NewTicket): Promise<Ticket> {
    const created = await insertTicket(data)
    setTickets((list) => mergeTicket(list, created))
    return created
  }

  async function advance(id: string, status: Status) {
    const updated = await patchStatus(id, advanceStatus(status))
    setTickets((list) => mergeTicket(list, updated))
  }

  async function remove(id: string) {
    await dropTicket(id)
    setTickets((list) => list.filter((t) => t.id !== id))
  }

  return { tickets, loading, error, retry, add, advance, remove }
}
