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

export const SupportedConnectors = getSelectedConnector(
  [metaMask, metaMaskhooks],
  [walletConnect, walletConnectHooks]
)

export * from './MetaMask'
export * from './WalletConnect'

export enum ConnectorName {
  MetaMask = 'MetaMask',
  WalletConnect = 'WalletConnect',
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

export const useAccount = () => {
  const lastConectorName = useAtomValue(lastConectorNameAtom)

  const account = SupportedConnectors.useSelectedAccount(
    Connectors.get(lastConectorName) ?? metaMask
  )

  if (lastConectorName) {
    return account
  }

  return undefined
}

export const useAccountIsActivating = () => {
  const lastConectorName = useAtomValue(lastConectorNameAtom)

  const status = SupportedConnectors.useSelectedIsActivating(
    Connectors.get(lastConectorName) ?? metaMask
  )

  if (lastConectorName) {
    return status
  }

  return false
}

export const useConnector = () => {
  const lastConectorName = useAtomValue(lastConectorNameAtom)

  return Connectors.get(lastConectorName)
}

export const useEagerConnect = (forceConnect = false) => {
  const lastConectorName = useLastConectorName()
  const connector = useConnector()
  useDidMount(() => {
    if (lastConectorName && connector) {
      if (forceConnect) {
        connector.activate()
      } else {
        connector?.connectEagerly?.()
      }
    }
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
