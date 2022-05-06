import { useAccount } from 'hooks'
import { useMemo } from 'react'
import { API } from '../api'

export const useAPI = () => {
  const account = useAccount()

  return useMemo(() => new API(account, ''), [account])
}
