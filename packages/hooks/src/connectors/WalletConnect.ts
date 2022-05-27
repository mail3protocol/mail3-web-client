import { initializeConnector } from '@web3-react/core'
import { WalletConnect } from '@web3-react/walletconnect'
import { URLS } from './chains'

export const [walletConnect, walletConnectHooks, walletConnectStore] =
  initializeConnector<WalletConnect>(
    (actions) =>
      new WalletConnect(actions, {
        rpc: URLS,
      }),
    Object.keys(URLS).map((chainId) => Number(chainId))
  )
