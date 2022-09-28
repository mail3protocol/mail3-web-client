import { useLocation } from 'react-router-dom'
import { useCallback, useEffect } from 'react'
import { useAccount, useSetLoginInfo } from 'hooks'
import dayjs from 'dayjs'
import { RoutePath } from '../route/path'
import { useRememberDialog } from './useRememberDialog'
import { useAPI } from './useAPI'

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

export const useLogin = () => {
  const api = useAPI()
  const setLoginInfo = useSetLoginInfo()
  return useCallback(
    async (message: string, sig: string, pubKey?: string) => {
      const { data } = await api.connection(message, sig, { pubKey })
      const now = dayjs()
      const loginInfo = {
        address: api.getAddress(),
        jwt: data.jwt,
        uuid: data.uuid,
        expires: now.add(14, 'day').toISOString(),
      }
      setLoginInfo(loginInfo)
      return loginInfo
    },
    [api]
  )
}
