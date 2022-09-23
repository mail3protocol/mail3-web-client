import { useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useAccount } from 'hooks'
import { RoutePath } from '../route/path'
import { useRememberDialog } from './useRememberDialog'

export function useAuth() {
  // TODO: login
  const { pathname } = useLocation()
  const account = useAccount()
  const onOpenRememberDialog = useRememberDialog()
  useEffect(() => {
    if (account && pathname === RoutePath.Index) {
      onOpenRememberDialog()
    }
  }, [account])
}
