import { useEffect, useState } from 'react'

export function useClockTick(intervalMs) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const intervalId = setInterval(() => setNow(Date.now()), intervalMs)
    return () => clearInterval(intervalId)
  }, [intervalMs])

  return now
}
