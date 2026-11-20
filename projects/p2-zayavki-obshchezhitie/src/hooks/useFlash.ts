import { useEffect, useState } from 'react'

// Всплывающее сообщение, которое само исчезает через timeout мс.
export function useFlash(timeout = 6000): [string, (message: string) => void] {
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (message === '') {
      return
    }
    const timer = setTimeout(() => setMessage(''), timeout)
    return () => clearTimeout(timer)
  }, [message, timeout])

  return [message, setMessage]
}
