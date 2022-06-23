import { COOKIE_KEY, useAccount, useJWT } from 'hooks'
import { useMemo } from 'react'
import { useCookies } from 'react-cookie'
import { API } from '../api'

export const useAPI = () => {
  const account = useAccount()
  const jwt = useJWT()
  const [, , removeCookie] = useCookies([COOKIE_KEY])
  const clearCookie = () => {
    removeCookie(COOKIE_KEY, { path: '/' })
  }
  return useMemo(() => new API(account, jwt, clearCookie), [account, jwt])
}
