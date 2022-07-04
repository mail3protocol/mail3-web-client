import dayjs from 'dayjs'
import { useCallback, useEffect } from 'react'
import { useCookies } from 'react-cookie'
import type { GetServerSidePropsContext, GetServerSideProps } from 'next'
import type { IncomingMessage } from 'http'
import universalCookie from 'cookie'
import {
  COOKIE_KEY,
  useAccount,
  useConnector,
  useConnectWalletDialog,
  LoginInfo,
  useJWT,
  useLastConectorName,
  GlobalDimensions,
  SignatureStatus,
  useDidMount,
  useAccountIsActivating,
} from 'hooks'
import { useRouter } from 'next/router'
import { atom, useAtomValue } from 'jotai'
import { atomWithStorage, useUpdateAtom } from 'jotai/utils'
import { useAPI } from './useAPI'
import { RoutePath } from '../route/path'
import { API } from '../api'
import { GOOGLE_ANALYTICS_ID, MAIL_SERVER_URL } from '../constants'
import { useEmailAddress } from './useEmailAddress'
import { useSetLoginInfo } from './useLoginInfo'
import { getUtmQueryString } from '../utils'

export const useSetLoginCookie = () => {
  const [, setCookie] = useCookies([COOKIE_KEY])
  return useCallback((info: LoginInfo) => {
    const now = dayjs()
    const option: Parameters<typeof setCookie>[2] = {
      path: '/',
      expires: now.add(14, 'day').toDate(),
    }
    setCookie(COOKIE_KEY, info, option)
  }, [])
}

export const useIsAuthenticated = () => {
  const jwt = useJWT()
  return !!jwt
}

export const useLogin = () => {
  const api = useAPI()
  const setLoginInfo = useSetLoginCookie()
  return useCallback(
    async (message: string, sig: string) => {
      const { data } = await api.login(message, sig)
      const loginInfo = {
        address: api.getAddress(),
        jwt: data.jwt,
        uuid: data.uuid,
      }
      setLoginInfo(loginInfo)
      return loginInfo
    },
    [api]
  )
}

export function parseCookies(req?: IncomingMessage) {
  try {
    const cookies = universalCookie.parse(
      req ? req.headers.cookie || '' : document.cookie
    )
    const cookie = cookies?.[COOKIE_KEY] ?? '{}'
    return JSON.parse(cookie)
  } catch (error) {
    return {}
  }
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
        const config = {
          defaultAddress,
          [GlobalDimensions.OwnEnsAddress]: aliases.aliases.length > 1,
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

export const useWalletChange = () => {
  const closeAuthModal = useCloseAuthModal()
  const [, , removeCookie] = useCookies([COOKIE_KEY])
  const { onOpen: openConnectWalletModal } = useConnectWalletDialog()
  const account = useAccount()
  const isConnecting = useAccountIsActivating()

  const handleAccountChanged = useCallback(
    ([acc]) => {
      // disconected
      if (acc === undefined) {
        removeCookie(COOKIE_KEY, { path: '/' })
        return
      }
      if (isConnecting || !account) {
        return
      }
      if (acc?.toLowerCase() === account?.toLowerCase()) {
        return
      }
      removeCookie(COOKIE_KEY, { path: '/' })
    },
    [account, isConnecting]
  )

  const handleDisconnect = useCallback(() => {
    removeCookie(COOKIE_KEY, { path: '/' })
    closeAuthModal()
    openConnectWalletModal()
  }, [])

  useEffect(() => {
    const w = window as any
    const { ethereum } = w
    if (ethereum && ethereum.on) {
      ethereum.on('disconnect', handleDisconnect)
      ethereum.on('accountsChanged', handleAccountChanged)
    }
    return () => {
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
  const router = useRouter()
  useEffect(() => {
    if (!isAuth && account) {
      openAuthModal()
    }
    if (!account) {
      closeAuthModal()
    }
  }, [isAuth, account])

  useEffect(() => {
    if (!isAuth && !allowWithoutAuthPaths.has(router.pathname)) {
      router.replace(RoutePath.Home)
    }
  }, [isAuth, router.pathname])

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

export const getAuthenticateProps =
  (cb?: GetServerSideProps) => async (context: GetServerSidePropsContext) => {
    const props = await cb?.(context)
    const { req, res, query } = context
    const data = parseCookies(req)
    if (res) {
      if (typeof data.jwt !== 'string') {
        res.writeHead(307, {
          Location: `/testing${getUtmQueryString(query)}`,
          'Cache-Control': 'no-cache, no-store',
          Pragma: 'no-cache',
        })
        res.end()
      }
    }
    return {
      ...props,
    } as any
  }
