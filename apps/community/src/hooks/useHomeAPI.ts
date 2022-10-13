import { useMemo } from 'react'
import { useAccount } from 'hooks'
import { useJWT } from './useLoginInfo'
import { HomeAPI } from '../api/HomeAPI'

export function useHomeAPI() {
  const account = useAccount()
  const jwt = useJWT()
  return useMemo(() => new HomeAPI(account, jwt), [account, jwt])
}
