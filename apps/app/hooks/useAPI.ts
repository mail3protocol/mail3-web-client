import { useAccount } from 'hooks'
import { useMemo } from 'react'
import { API } from '../api'
import { useJWT } from './useLogin'

export const useAPI = () => {
  const account = useAccount()
  const jwt = useJWT()
  return useMemo(() => new API(account, jwt), [account, jwt])
}
