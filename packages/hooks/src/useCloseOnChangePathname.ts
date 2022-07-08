import { useLocation } from 'react-router-dom'
import { useEffect } from 'react'

export function useCloseOnChangePathname(onClose: () => void, enable = true) {
  const location = useLocation()
  useEffect(() => {
    if (!enable) return
    onClose()
  }, [enable, location.pathname])
}
