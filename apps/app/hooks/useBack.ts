import { useNavigate } from 'react-router-dom'
import { useCallback } from 'react'
import { RoutePath } from '../route/path'

export function useBack() {
  const navi = useNavigate()
  return useCallback(() => {
    if (window.history.length === 1) {
      navi(RoutePath.Inbox)
    } else {
      navi(-1)
    }
  }, [navi])
}
