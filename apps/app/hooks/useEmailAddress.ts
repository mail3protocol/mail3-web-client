import { useMemo } from 'react'
import { CurrentConnector } from '../connectors'
import { truncateMiddle } from '../utils'

const { usePriorityAccount } = CurrentConnector

export const useEmailAddress = () => {
  const account = usePriorityAccount()

  return useMemo(
    () => (account ? `${truncateMiddle(`0x${account}`, 6, 4)}@mail3.me` : ''),
    [account]
  )
}
