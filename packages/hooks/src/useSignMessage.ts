import { useCallback } from 'react'
import {
  ConnectorName,
  CurrentChain,
  useCurrentChain,
  useLastConectorName,
  useProvider,
  zilpay,
} from './connectors'

const { signMessage } = require('@joyid/evm')

export class NotConnectWallet extends Error {}

export function useSignMessage() {
  const provider = useProvider()
  const currentChain = useCurrentChain()
  const lastConectorName = useLastConectorName()
  return useCallback(
    (message: string) => {
      if (currentChain === CurrentChain.Zilliqa) {
        return zilpay.signMessage(message)
      }
      if (lastConectorName === ConnectorName.JoyID) {
        return signMessage(message)
      }
      if (provider == null) {
        throw new NotConnectWallet('Please connect a wallet')
      }
      return provider.getSigner().signMessage(message)
    },
    [provider, currentChain]
  )
}
