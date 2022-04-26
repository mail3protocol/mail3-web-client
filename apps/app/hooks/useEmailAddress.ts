import { useMemo } from 'react'
import { useAccount } from 'hooks'
import { truncateMiddle } from '../utils'

export const useEmailAddress = () => {
  const account = useAccount()

  return useMemo(
    () =>
      account
        ? `${truncateMiddle(`0x${account}`, 6, 4).toLowerCase()}@mail3.me`
        : '',
    [account]
  )
}
