import dayjs from 'dayjs'
import { useCallback, useEffect, useMemo } from 'react'
import {
  useAccount,
  useConnector,
  useConnectWalletDialog,
  useLastConectorName,
  GlobalDimensions,
  SignatureStatus,
  useDidMount,
  useAccountIsActivating,
  zilpay,
  useLoginAccount,
  // useConnectedAccount,
  useSetLoginInfo,
  useLoginInfo,
  ConnectorName,
  metaMaskStore,
  walletConnectStore,
  useSetLastConnector,
} from 'hooks'
import { useLocation, useNavigate } from 'react-router-dom'
import { atom, useAtomValue } from 'jotai'
import { atomWithStorage, useUpdateAtom } from 'jotai/utils'
import { isBitDomain, isEnsDomain } from 'shared'
import { useAPI } from './useAPI'
import { RoutePath } from '../route/path'
import { API } from '../api'
import { GOOGLE_ANALYTICS_ID, MAIL_SERVER_URL } from '../constants'
import { useEmailAddress } from './useEmailAddress'
import { removeMailSuffix } from '../utils'

export const useIsLoginExpired = () => {
  const loginInfo = useLoginInfo()
  return useMemo(
    () => (loginInfo ? dayjs(loginInfo?.expires).isAfter(dayjs()) : false),
    [loginInfo]
  )
}

export const useIsAuthenticated = () => {
  const loginInfo = useLoginInfo()
  const isLoginExpired = useIsLoginExpired()
  return useMemo(() => {
    if (loginInfo?.expires) {
      return isLoginExpired
    }
    return !!loginInfo?.jwt
  }, [loginInfo, isLoginExpired])
}

export const useLogin = () => {
  const api = useAPI()
  const setLoginInfo = useSetLoginInfo()
  return useCallback(
    async (message: string, sig: string, pubkey?: string) => {
      const { data } = await api.login(message, sig, pubkey)
      const now = dayjs()
      const loginInfo = {
        address: api.getAddress(),
        jwt: data.jwt,
        uuid: data.uuid,
        expires: now.add(14, 'day').toISOString(),
      }
      setLoginInfo(loginInfo)
      return loginInfo
    },
    [api]
  )
}

export const isAuthModalOpenAtom = atom(false)

export const useOpenAuthModal = () => {
  const setAuthModalOpen = useUpdateAtom(isAuthModalOpenAtom)
  return () => setAuthModalOpen(true)
}

export const useCloseAuthModal = () => {
  const setAuthModalOpen = useUpdateAtom(isAuthModalOpenAtom)
  return () => setAuthModalOpen(false)
}

export const useIsAuthModalOpen = () => useAtomValue(isAuthModalOpenAtom)

export const allowWithoutAuthPaths = new Set<string>([
  RoutePath.Home,
  RoutePath.WhiteList,
  RoutePath.Testing,
])

export const useCurrentWalletStore = () => {
  const walletName = useLastConectorName()
  if (walletName === ConnectorName.MetaMask) {
    return metaMaskStore
  }
  if (walletName === ConnectorName.WalletConnect) {
    return walletConnectStore
  }
  return metaMaskStore
}

export const userPropertiesAtom = atomWithStorage<Record<string, any> | null>(
  'mail3_user_properties',
  null
)

export function getSigStatus<
  T extends {
    card_sig_state: 'enabled' | 'disabled'
    text_sig_state: 'enabled' | 'disabled'
  }
>(info: T): SignatureStatus {
  let sigStatus: SignatureStatus = SignatureStatus.OnlyText
  if (info.card_sig_state === 'enabled' && info.text_sig_state === 'enabled') {
    sigStatus = SignatureStatus.BothEnabled
  } else if (
    info.card_sig_state === 'enabled' &&
    info.text_sig_state === 'disabled'
  ) {
    sigStatus = SignatureStatus.OnlyImage
  } else if (
    info.card_sig_state === 'disabled' &&
    info.text_sig_state === 'enabled'
  ) {
    sigStatus = SignatureStatus.OnlyText
  } else if (
    info.card_sig_state === 'disabled' &&
    info.text_sig_state === 'disabled'
  ) {
    sigStatus = SignatureStatus.BothDisabled
  }
  return sigStatus
}

export const useSetGlobalTrack = () => {
  const account = useAccount()
  const walletName = useLastConectorName()
  const setUserProperties = useUpdateAtom(userPropertiesAtom)
  const emailAddress = useEmailAddress()
  return useCallback(
    async (jwt: string) => {
      try {
        const api = new API(account, jwt)
        const [{ data: userInfo }, { data: aliases }] = await Promise.all([
          api.getUserInfo(),
          api.getAliases(),
        ])
        const sigStatus = getSigStatus(userInfo)
        const defaultAddress =
          aliases.aliases.find((a) => a.is_default)?.address ||
          `${account}@${MAIL_SERVER_URL}`
        let isOwnBitAddress = false
        let isOwnEnsAddress = false
        for (let i = 0; i < aliases.aliases.length; i++) {
          const alias = aliases.aliases[i]
          const addr = removeMailSuffix(alias.address)
          if (isEnsDomain(addr)) {
            isOwnEnsAddress = true
          }
          if (isBitDomain(addr)) {
            isOwnBitAddress = true
          }
        }
        const config = {
          defaultAddress,
          [GlobalDimensions.OwnEnsAddress]: isOwnEnsAddress,
          [GlobalDimensions.OwnBitAddress]: isOwnBitAddress,
          [GlobalDimensions.ConnectedWalletName]: walletName,
          [GlobalDimensions.WalletAddress]: `@${account}`,
          [GlobalDimensions.SignatureStatus]: sigStatus,
          crm_id: `@${account}`,
          text_signature: userInfo.text_signature,
          aliases: aliases.aliases,
        }
        try {
          gtag?.('set', 'user_properties', config)
          gtag?.('config', `${GOOGLE_ANALYTICS_ID}`, {
            user_id: `@${account}`,
          })
        } catch (error) {
          //
        }
        setUserProperties(config)
      } catch (error) {
        // todo sentry
      }
    },
    [account, walletName, emailAddress]
  )
}

export const useInitUserProperties = () => {
  const isAuth = useIsAuthenticated()
  const userProps = useAtomValue(userPropertiesAtom)
  const setUserProperties = useUpdateAtom(userPropertiesAtom)
  const setLoginInfo = useSetLoginInfo()
  useDidMount(() => {
    if (userProps && isAuth) {
      try {
        gtag?.('set', 'user_properties', userProps)
        if (userProps.wallet_address) {
          gtag?.('config', `${GOOGLE_ANALYTICS_ID}`, {
            user_id: userProps.wallet_address,
          })
        }
      } catch (error) {
        //
      }
    }
  })

  useEffect(() => {
    if (!isAuth) {
      try {
        gtag?.('set', 'user_properties', {})
      } catch (error) {
        //
      }
      setUserProperties(null)
      setLoginInfo(null)
    }
  }, [isAuth])
}

export const useLogout = () => {
  const connector = useConnector()
  const setUserInfo = useSetLoginInfo()
  const setLastConnector = useSetLastConnector()
  return useCallback(async () => {
    await connector?.deactivate()
    setUserInfo(null)
    setLastConnector(undefined)
  }, [connector])
}

export const useWalletChange = () => {
  const closeAuthModal = useCloseAuthModal()
  const setLoginInfo = useSetLoginInfo()
  const { onOpen: openConnectWalletModal } = useConnectWalletDialog()
  const loginAccount = useLoginAccount()
  const isConnecting = useAccountIsActivating()
  const store = useCurrentWalletStore()
  const logout = useLogout()
  const handleAccountChanged = useCallback(
    ([acc]) => {
      const [account] = store.getState().accounts ?? []

      if (acc === undefined) {
        setLoginInfo(null)
        return
      }
      if (isConnecting || !account) {
        return
      }
      if (acc?.toLowerCase() === account?.toLowerCase()) {
        return
      }
      if (
        loginAccount &&
        account &&
        loginAccount.toLowerCase() !== account?.toLowerCase()
      ) {
        return
      }
      setLoginInfo(null)
    },
    [isConnecting, loginAccount]
  )
  const handleZilpayAccountChanged = useCallback(
    (acc: any) => {
      if (loginAccount && !loginAccount.startsWith('zil')) {
        return
      }
      if (acc == null) {
        logout()
        return
      }
      if (loginAccount == null) {
        return
      }
      if (acc?.bech32 === loginAccount) {
        return
      }
      logout()
    },
    [loginAccount]
  )
  const handleDisconnect = useCallback(() => {
    setLoginInfo(null)
    closeAuthModal()
    openConnectWalletModal()
  }, [])

  useEffect(() => {
    const w = window as any
    const { ethereum } = w
    let zilpaySubscriber: any
    if (w.zilPay && zilpay.isInstalled()) {
      try {
        zilpaySubscriber = zilpay
          .getObservableAccount()
          .subscribe(handleZilpayAccountChanged)
      } catch (error) {
        //
      }
    }
    if (ethereum && ethereum.on) {
      ethereum.on('disconnect', handleDisconnect)
      ethereum.on('accountsChanged', handleAccountChanged)
    }
    return () => {
      if (zilpaySubscriber) {
        zilpaySubscriber?.unsubscribe?.()
      }
      if (ethereum && ethereum.off) {
        ethereum.off('disconnect', handleDisconnect)
        ethereum.off('accountsChanged', handleAccountChanged)
      }
    }
  }, [])
}

export const useAuth = () => {
  const isAuth = useIsAuthenticated()
  const account = useAccount()
  const openAuthModal = useOpenAuthModal()
  const closeAuthModal = useCloseAuthModal()
  const location = useLocation()
  const navi = useNavigate()
  useEffect(() => {
    if (!isAuth && account) {
      openAuthModal()
    }
    if (!account) {
      closeAuthModal()
    }
  }, [isAuth, account])

  useEffect(() => {
    if (!isAuth && !allowWithoutAuthPaths.has(location.pathname)) {
      navi(RoutePath.Home, {
        replace: true,
      })
    }
  }, [isAuth, location.pathname])

  useInitUserProperties()
  useWalletChange()
}

export const useAuthModalOnBack = () => {
  const connector = useConnector()
  const { onOpen } = useConnectWalletDialog()
  const closeAuthModal = useCloseAuthModal()
  return useCallback(async () => {
    await connector?.deactivate()
    closeAuthModal()
    onOpen()
  }, [connector])
}
