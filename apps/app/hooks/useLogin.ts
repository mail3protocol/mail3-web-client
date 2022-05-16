import dayjs from 'dayjs'
import { useCallback, useEffect } from 'react'
import { useCookies } from 'react-cookie'
import type { GetServerSidePropsContext, GetServerSideProps } from 'next'
import type { IncomingMessage } from 'http'
import universalCookie from 'cookie'
import {
  useAccount,
  useConnector,
  useConnectWalletDialog,
  useProvider,
} from 'hooks'
import { atom, useAtomValue } from 'jotai'
import { useUpdateAtom } from 'jotai/utils'
import { useAPI } from './useAPI'

const COOKIE_KEY = '__MAIL3__'

export interface LoginInfo {
  address: string
  jwt: string
  uuid: string
}

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

export const useJWT = () => {
  const [cookie] = useCookies([COOKIE_KEY])
  return cookie?.[COOKIE_KEY]?.jwt
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

export const useAuth = () => {
  const isAuth = useIsAuthenticated()
  const account = useAccount()
  const openAuthModal = useOpenAuthModal()
  const [, , removeCookie] = useCookies([COOKIE_KEY])
  const provider = useProvider()
  useEffect(() => {
    if (!isAuth && account) {
      openAuthModal()
    }
  }, [isAuth, account])

  useEffect(() => {
    const clearCookie = () => {
      removeCookie(COOKIE_KEY, { path: '/' })
    }
    const w = window as any
    const { ethereum } = w
    if (ethereum && ethereum.on) {
      ethereum.on('disconnect', clearCookie)
      ethereum.on('accountsChanged', clearCookie)
    }
    if (provider && provider.on) {
      provider.on('disconnect', clearCookie)
      provider.on('accountsChanged', clearCookie)
    }
    return () => {
      if (ethereum && ethereum.off) {
        ethereum.off('disconnect', clearCookie)
        ethereum.off('accountsChanged', clearCookie)
      }
      if (provider && provider.off) {
        provider.off('disconnect', clearCookie)
        provider.off('accountsChanged', clearCookie)
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
