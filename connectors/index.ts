import { getPriorityConnector, getSelectedConnector } from '@web3-react/core'
import { metaMask, metaMaskhooks } from './MetaMask'
import { walletConnect, walletConnectHooks } from './WalletConnect'

export const CurrentConnector = getPriorityConnector(
  [metaMask, metaMaskhooks],
  [walletConnect, walletConnectHooks]
)

export const SupportedConnectors = getSelectedConnector(
  [metaMask, metaMaskhooks],
  [walletConnect, walletConnectHooks]
)
