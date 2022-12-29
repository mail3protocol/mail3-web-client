import { useEffect, useState } from 'react'
import { Routers } from '../../route'

export const passToClient = ['pageProps']

export function Page() {
  const [isRender, setIsRender] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsRender(true)
    }
  }, [])

  return isRender ? <Routers /> : null
}

export const clientRouting = true
