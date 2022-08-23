import { getSelectedConnector } from '@web3-react/core'
import type { Connector } from '@web3-react/types'
import {
  atomWithStorage,
  createJSONStorage,
  useAtomValue,
  useUpdateAtom,
} from 'jotai/utils'
import { atom, useAtom } from 'jotai'
import { useMemo } from 'react'
import { useDidMount } from '../useDidMount'
import { metaMask, metaMaskhooks } from './MetaMask'
import { walletConnect, walletConnectHooks } from './WalletConnect'
import { coinbase, coinbaseHooks } from './Coinbase'
import { useLoginAccount } from '../useLoginInfo'
import { zilpay } from './zilpay'

export const SupportedConnectors = getSelectedConnector(
  [metaMask, metaMaskhooks],
  [walletConnect, walletConnectHooks],
  [coinbase, coinbaseHooks]
)

export * from './MetaMask'
export * from './WalletConnect'
export * from './Coinbase'

export enum ConnectorName {
  MetaMask = 'MetaMask',
  WalletConnect = 'WalletConnect',
  Zilpay = 'Zilpay',
  Coinbase = 'Coinbase',

  // 👇 Not supported
  Phantom = 'Phantom',
  Solflare = 'Solflare',
  Blocto = 'Blocto',
  Avalance = 'Avalance',
  TronLink = 'TronLink',
  Keplr = 'Keplr',
  Plug = 'Plug',
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
Connectors.set(ConnectorName.Coinbase, coinbase)

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

  if (lastConectorName) {
    if (lastConectorName === ConnectorName.Zilpay && zilpay.isConnected()) {
      return zilpay.getBech32Address()
    }
    if (account && Array.isArray(account)) {
      return account[0]
    }
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

export enum CurrentChain {
  Ethereum = 'ethereum',
  Zilliqa = 'Zilliqa',
  None = 'None',
}

export const useCurrentChain = () => {
  const account = useAccount()
  return useMemo(() => {
    if (account.startsWith('0x')) {
      return CurrentChain.Ethereum
    }
    if (account.startsWith('zil')) {
      return CurrentChain.Zilliqa
    }
    return CurrentChain.None
  }, [account])
}

export * from './zilpay'
