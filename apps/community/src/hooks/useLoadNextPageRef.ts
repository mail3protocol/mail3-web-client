import { useEffect, useRef } from 'react'

export function useLoadNextPageRef(callback: IntersectionObserverCallback) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (ref.current) {
      const io = new IntersectionObserver(callback, {
        root: null,
        rootMargin: '0px 0px 0px 0px',
      })
      io.observe(ref.current)
      return () => {
        io.disconnect()
      }
    }
    return () => {}
  }, [callback])
  return ref
}
