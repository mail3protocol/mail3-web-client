import { useMemo } from 'react'
import { useLoginAccount } from 'hooks'
import { truncateMiddle } from 'shared'
import { MAIL_SERVER_URL } from '../constants'

export const useEmailAddress = () => {
  const account = useLoginAccount()

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
