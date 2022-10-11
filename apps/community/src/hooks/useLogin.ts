import { useLocation, useNavigate } from 'react-router-dom'
import { useCallback, useEffect, useMemo } from 'react'
import {
  ConnectorName,
  metaMaskStore,
  useAccount,
  useAccountIsActivating,
  useConnector,
  useConnectWalletDialog,
  useLastConectorName,
  useLoginAccount,
  useLoginInfo,
  useSetLastConnector,
  useSetLoginInfo,
  walletConnectStore,
  zilpay,
} from 'hooks'
import dayjs from 'dayjs'
import { atomWithStorage, useUpdateAtom } from 'jotai/utils'
import { useQuery } from 'react-query'
import {
  allowWithoutAuthPathnameSet,
  unauthorizedRedirectTo,
} from '../route/guard/auth'
import { useAPI } from './useAPI'
import { useCloseAuthModal, useOpenAuthModal } from './useAuthDialog'
import { QueryKey } from '../api/QueryKey'

export const userPropertiesAtom = atomWithStorage<Record<string, any> | null>(
  'mail3_community_user_properties',
  null
)

export const useLogin = () => {
  const api = useAPI()
  const setLoginInfo = useSetLoginInfo()
  return useCallback(
    async (message: string, sig: string, pubKey?: string) => {
      const { data } = await api.connection(message, sig, { pubKey })
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

export function useIsLoginExpired() {
  const loginInfo = useLoginInfo()
  return useMemo(
    () => (loginInfo ? dayjs(loginInfo?.expires).isAfter(dayjs()) : false),
    [loginInfo]
  )
}

export function useIsAuthenticated() {
  const loginInfo = useLoginInfo()
  const isLoginExpired = useIsLoginExpired()
  return useMemo(() => {
    if (loginInfo?.expires) {
      return isLoginExpired
    }
    return !!loginInfo?.jwt
  }, [loginInfo, isLoginExpired])
}

export function useInitUserProperties() {
  const isAuth = useIsAuthenticated()
  const setUserProperties = useUpdateAtom(userPropertiesAtom)
  const setLoginInfo = useSetLoginInfo()

  useEffect(() => {
    if (!isAuth) {
      setUserProperties(null)
      setLoginInfo(null)
    }
  }, [isAuth])
}

export function useLogout() {
  const connector = useConnector()
  const setUserInfo = useSetLoginInfo()
  const setLastConnector = useSetLastConnector()
  return useCallback(async () => {
    setUserInfo(null)
    setLastConnector(undefined)
    await connector?.deactivate()
  }, [connector])
}

export function useCurrentWalletStore() {
  const walletName = useLastConectorName()
  if (walletName === ConnectorName.MetaMask) {
    return metaMaskStore
  }
  if (walletName === ConnectorName.WalletConnect) {
    return walletConnectStore
  }
  return metaMaskStore
}

export function useWalletChange() {
  const closeAuthModal = useCloseAuthModal()
  const setLoginInfo = useSetLoginInfo()
  const { onOpen: openConnectWalletModal } = useConnectWalletDialog()
  const loginAccount = useLoginAccount()
  const isConnecting = useAccountIsActivating()
  const store = useCurrentWalletStore()
  const logout = useLogout()
  const handleAccountChanged = useCallback(
    ([acc]: any[]) => {
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
      if (loginAccount == null && acc != null) {
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

export function useIsCommunityUser() {
  const api = useAPI()
  const account = useAccount()
  const { data: isCommunityUser = false, ...other } = useQuery(
    [QueryKey.CheckUser, account],
    async () =>
      api
        .checkUser(account)
        .then(() => true)
        .catch(() => false),
    {
      enabled: !!account,
    }
  )
  return {
    isCommunityUser,
    ...other,
  }
}

export function useAuth() {
  const isAuth = useIsAuthenticated()
  const account = useAccount()
  const openAuthModal = useOpenAuthModal()
  const closeAuthModal = useCloseAuthModal()
  const { pathname } = useLocation()
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
    if (!isAuth && !allowWithoutAuthPathnameSet.has(pathname)) {
      navi(unauthorizedRedirectTo, {
        replace: true,
      })
    }
  }, [isAuth, location.pathname])

  useInitUserProperties()
  useWalletChange()
}
