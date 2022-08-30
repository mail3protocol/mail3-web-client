import { useDidMount } from 'hooks'
import { isCoinbaseWallet } from '../utils'
import { useCloseAuthModal } from './useLogin'

export function useAutoConnectCoinbase(callback: () => void) {
  const closeAuthModal = useCloseAuthModal()
  useDidMount(() => {
    if (isCoinbaseWallet()) {
      closeAuthModal()
      callback()
    }
  })
}
