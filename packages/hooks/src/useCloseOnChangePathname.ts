import { useRouter } from 'next/router'
import { useEffect } from 'react'

export function useCloseOnChangePathname(onClose: () => void, enable = true) {
  const router = useRouter()
  useEffect(() => {
    if (!enable) return
    onClose()
  }, [enable, router.pathname])
}
