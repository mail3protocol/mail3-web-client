import { useJWT, useSetLoginInfo, useLoginAccount } from 'hooks'
import { useMemo } from 'react'
import { API } from '../api'
import { HomeAPI } from '../api/homeApi'

export const useAPI = () => {
  const account = useLoginAccount()
  const jwt = useJWT()
  const setLoginInfo = useSetLoginInfo()
  const clearCookie = () => {
    setLoginInfo(null)
  }
  return useMemo(() => new API(account, jwt, clearCookie), [account, jwt])
}

export const useHomeAPI = () => {
  const account = useLoginAccount()
  const jwt = useJWT()
  return useMemo(() => new HomeAPI(account, jwt), [account, jwt])
}
