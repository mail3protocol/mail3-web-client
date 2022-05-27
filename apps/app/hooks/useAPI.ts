import { useAccount, useJWT } from 'hooks'
import { useMemo } from 'react'
import { API } from '../api'

export const useAPI = () => {
  const account = useAccount()
  const jwt = useJWT()
  return useMemo(() => new API(account, jwt), [account, jwt])
}
