import { useMemo } from 'react'
import { useAccount, useLoginInfo } from 'hooks'
import { HomeAPI } from '../api/HomeAPI'
import { useLogout } from './useLogin'

export function useHomeAPI() {
  const account = useAccount()
  const jwt = useLoginInfo()?.jwt
  const logout = useLogout()
  return useMemo(() => {
    const api = new HomeAPI(account, jwt)
    api.axiosInstance.interceptors.response.use(
      (r) => r,
      async (err) => {
        if (err.response.status === 401) {
          await logout()
        }
        throw err
      }
    )
    return api
  }, [account, jwt])
}
