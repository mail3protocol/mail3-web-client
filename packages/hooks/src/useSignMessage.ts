import { useCallback } from 'react'
import { Bytes } from '@ethersproject/bytes'
import { useProvider } from './connectors'

export class NotConnectWallet extends Error {}

export function useSignMessage() {
  const provider = useProvider()
  return useCallback(
    (message: Bytes | string) => {
      if (provider == null) {
        throw new NotConnectWallet('Please connect a wallet')
      }
      return provider.getSigner().signMessage(message)
    },
    [provider]
  )
}
