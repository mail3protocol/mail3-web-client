import { getSelectedConnector } from '@web3-react/core'
import type { Connector } from '@web3-react/types'
import {
  atomWithStorage,
  createJSONStorage,
  useAtomValue,
  useUpdateAtom,
} from 'jotai/utils'
import { atom, useAtom } from 'jotai'
import { useDidMount } from '../useDidMount'
import { metaMask, metaMaskhooks } from './MetaMask'
import { walletConnect, walletConnectHooks } from './WalletConnect'
import { useLoginAccount } from '../useLoginInfo'

export const SupportedConnectors = getSelectedConnector(
  [metaMask, metaMaskhooks],
  [walletConnect, walletConnectHooks]
)

export * from './MetaMask'
export * from './WalletConnect'

export enum ConnectorName {
  MetaMask = 'MetaMask',
  WalletConnect = 'WalletConnect',

  // 👇 Not supported
  Phantom = 'Phantom',
  Solflare = 'Solflare',
  Blocto = 'Blocto',
  Avalance = 'Avalance',
  TronLink = 'TronLink',
  Coinbase = 'Coinbase',
  Keplr = 'Keplr',
  Plug = 'Plug',
  Zilpay = 'Zilpay',
  Polkawallet = 'Polkawallet',
}

const lastConectorNameAtom = atomWithStorage<ConnectorName | undefined>(
  'mail3_last_connector_name',
  undefined,
  {
    ...createJSONStorage(() => localStorage),
    delayInit: false,
  }
)

const Connectors = new Map<ConnectorName | undefined, Connector>()
Connectors.set(ConnectorName.MetaMask, metaMask)
Connectors.set(ConnectorName.WalletConnect, walletConnect)

export const useSetLastConnector = () => useUpdateAtom(lastConectorNameAtom)
export const useLastConectorName = () => useAtomValue(lastConectorNameAtom)

export const useConnectedAccount = () => {
  const lastConectorName = useAtomValue(lastConectorNameAtom)
  const account = SupportedConnectors.useSelectedAccounts(
    Connectors.get(lastConectorName) ?? metaMask
  )

  if (lastConectorName && account?.[0]) {
    return account?.[0]
  }

  return ''
}

export const useAccount = () => {
  const loginAccount = useLoginAccount()
  const connectedAccount = useConnectedAccount()

  if (loginAccount) {
    return loginAccount
  }

  return connectedAccount
}

export const useAccountIsActivating = () => {
  const lastConectorName = useAtomValue(lastConectorNameAtom)
  const conector = Connectors.get(lastConectorName)
  const status = SupportedConnectors.useSelectedIsActivating(
    conector ?? metaMask
  )

  if (!conector) {
    return false
  }

  if (lastConectorName) {
    return status
  }

  return false
}

export const useProvider = () => {
  const lastConectorName = useAtomValue(lastConectorNameAtom)

  const provider = SupportedConnectors.useSelectedProvider(
    Connectors.get(lastConectorName) ?? metaMask
  )

  if (lastConectorName && provider) {
    return provider
  }

  return undefined
}

export const useConnector = () => {
  const lastConectorName = useAtomValue(lastConectorNameAtom)

  return Connectors.get(lastConectorName)
}

export const useEagerConnect = (forceConnect = false) => {
  const lastConectorName = useLastConectorName()
  const connector = useConnector()
  useDidMount(() => {
    setTimeout(() => {
      if (lastConectorName && connector) {
        if (forceConnect) {
          connector.activate()
        } else {
          connector?.connectEagerly?.()
        }
      }
    }, 500)
  })
}

export const isConnectWalletDialogOpen = atom(false)

export const useConnectWalletDialog = () => {
  const [isOpen, setIsOpen] = useAtom(isConnectWalletDialogOpen)

  return {
    isOpen,
    onOpen() {
      setIsOpen(true)
    },
    onClose() {
      setIsOpen(false)
    },
  }
}
