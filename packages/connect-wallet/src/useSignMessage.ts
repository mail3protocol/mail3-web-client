import { useCallback } from 'react'
import {
  CurrentChain,
  useCurrentChain,
  useProvider,
  zilpay,
} from './connectors'

export class NotConnectWallet extends Error {}

export function useSignMessage() {
  const provider = useProvider()
  const currentChain = useCurrentChain()
  return useCallback(
    (message: string) => {
      if (currentChain === CurrentChain.Zilliqa) {
        return zilpay.signMessage(message)
      }
      if (provider == null) {
        throw new NotConnectWallet('Please connect a wallet')
      }
      return provider.getSigner().signMessage(message)
    },
    [provider, currentChain]
  )
}
