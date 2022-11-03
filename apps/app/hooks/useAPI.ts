import { useAccount, useJWT, useSetLoginInfo } from 'hooks'
import { useMemo } from 'react'
import { API } from '../api'
import { HomeAPI } from '../api/homeApi'

export const useAPI = () => {
  const account = useAccount()
  const jwt = useJWT()
  const setLoginInfo = useSetLoginInfo()
  const clearCookie = () => {
    setLoginInfo(null)
  }
  return useMemo(() => new API(account, jwt, clearCookie), [account, jwt])
}

export const useHomeAPI = () => {
  const account = useAccount()
  const jwt = useJWT()
  return useMemo(() => new HomeAPI(account, jwt), [account, jwt])
}
