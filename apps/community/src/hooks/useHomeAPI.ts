import { useMemo } from 'react'
import { useAccount, useLoginInfo } from 'hooks'
import { HomeAPI } from '../api/HomeAPI'

export function useHomeAPI() {
  const account = useAccount()
  const jwt = useLoginInfo()?.jwt
  return useMemo(() => new HomeAPI(account, jwt), [account, jwt])
}
