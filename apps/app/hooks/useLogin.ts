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
  useProvider,
  LoginInfo,
  useJWT,
} from 'hooks'
import { useRouter } from 'next/router'
import { atom, useAtomValue } from 'jotai'
import { useUpdateAtom } from 'jotai/utils'
import { useAPI } from './useAPI'
import { RoutePath } from '../route/path'

export const useSetLoginCookie = () => {
  const [, setCookie] = useCookies([COOKIE_KEY])
  return useCallback((info: LoginInfo) => {
    const now = dayjs()
    setCookie(COOKIE_KEY, info, {
      path: '/',
      expires: now.add(14, 'day').toDate(),
    })
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
      setLoginInfo({
        address: api.getAddress(),
        jwt: data.jwt,
        uuid: data.uuid,
      })
    },
    [api]
  )
}

function parseCookies(req?: IncomingMessage) {
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

export const allowWithoutAuthPaths = new Set<string>([RoutePath.Home])

export const useAuth = () => {
  const isAuth = useIsAuthenticated()
  const account = useAccount()
  const openAuthModal = useOpenAuthModal()
  const closeAuthModal = useCloseAuthModal()
  const [, , removeCookie] = useCookies([COOKIE_KEY])
  const { onOpen: openConnectWalletModal } = useConnectWalletDialog()
  const provider = useProvider()
  const router = useRouter()
  useEffect(() => {
    if (!isAuth && account) {
      openAuthModal()
    }
  }, [isAuth, account])

  useEffect(() => {
    if (!isAuth && !allowWithoutAuthPaths.has(router.pathname)) {
      router.replace(RoutePath.Home)
    }
  }, [isAuth, router.pathname])

  useEffect(() => {
    const handleAccountChanged = () => {
      removeCookie(COOKIE_KEY, { path: '/' })
    }
    const handleDisconnect = () => {
      removeCookie(COOKIE_KEY, { path: '/' })
      closeAuthModal()
      openConnectWalletModal()
    }
    const w = window as any
    const { ethereum } = w
    if (ethereum && ethereum.on) {
      ethereum.on('disconnect', handleDisconnect)
      ethereum.on('accountsChanged', handleAccountChanged)
    }
    if (provider && provider.on) {
      provider.on('disconnect', handleDisconnect)
      provider.on('accountsChanged', handleAccountChanged)
    }
    return () => {
      if (ethereum && ethereum.off) {
        ethereum.off('disconnect', handleDisconnect)
        ethereum.off('accountsChanged', handleAccountChanged)
      }
      if (provider && provider.off) {
        provider.off('disconnect', handleDisconnect)
        provider.off('accountsChanged', handleAccountChanged)
      }
    }
  }, [provider])
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
    const { req, res } = context
    const data = parseCookies(req)
    if (res) {
      if (typeof data.jwt !== 'string') {
        res.writeHead(307, {
          Location: '/',
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
