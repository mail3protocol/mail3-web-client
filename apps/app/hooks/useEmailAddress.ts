import { useMemo } from 'react'
import { useAccount } from 'hooks'
import { truncateMiddle } from '../utils'
import { MAIL_SERVER_URL } from '../constants'

export const useEmailAddress = () => {
  const account = useAccount()

  return useMemo(
    () =>
      account
        ? `${truncateMiddle(
            `${account}`,
            6,
            4
          ).toLowerCase()}@${MAIL_SERVER_URL}`
        : '',
    [account]
  )
}
