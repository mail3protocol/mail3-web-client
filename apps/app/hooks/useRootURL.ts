import { useEffect, useState } from 'react'
import { APP_URL } from '../constants'

export function useRootURL() {
  const [rootURL, setRootURL] = useState(APP_URL)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setRootURL(window.location.origin)
    }
  }, [])
  return rootURL
}
