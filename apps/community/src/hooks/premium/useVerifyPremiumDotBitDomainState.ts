import { useState } from 'react'
import { useAPI } from '../useAPI'
import { ErrorCode } from '../../api/ErrorCode'

export type SubDomainState =
  | ErrorCode.DOT_BIT_ACCOUNT_NOT_OPENED
  | ErrorCode.DOT_BIT_ACCOUNT_NOT_SET_LOWEST_PRICE
  | ErrorCode.NOT_OWNED_THE_DOT_BIT_ACCOUNT
  | null

export function useVerifyPremiumDotBitDomainState() {
  const api = useAPI()
  const [isLoading, setIsLoading] = useState(false)
  const onVerify = async (value: string) => {
    setIsLoading(true)
    const reason = await api
      .updateUserPremiumSettings(value)
      .then(() => null)
      .catch((err) => err?.response?.data?.reason)
    setIsLoading(false)
    return reason as SubDomainState
  }
  return {
    onVerify,
    isLoading,
  }
}
