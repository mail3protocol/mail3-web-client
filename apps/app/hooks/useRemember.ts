import { useTranslation } from 'react-i18next'
import {
  buildSignMessage,
  ConnectorName,
  SignupResponseCode,
  TrackEvent,
  TrackKey,
  useAccount,
  useLastConectorName,
  useProvider,
  useSignup,
  useToast,
  useTrackClick,
  zilpay,
} from 'hooks'
import { useLocation, useNavigate } from 'react-router-dom'
import { atom, useAtom } from 'jotai'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import { isSupportedAddress } from 'shared'
import { SERVER_URL } from '../constants'
import {
  isConnectingUDAtom,
  useCloseAuthModal,
  useLogin,
  useSetGlobalTrack,
} from './useLogin'
import { RoutePath } from '../route/path'
import { isCoinbaseWallet } from '../utils'

const { signMessage } = require('@joyid/evm')

export class NoOnWhiteListError extends Error {}

export const rememberLoadingAtom = atom(false)

export function useRememberLoading() {
  return useAtomValue(rememberLoadingAtom)
}

export function useRemember() {
  const [t] = useTranslation('common')
  const account = useAccount()
  const [isLoading, setIsLoading] = useAtom(rememberLoadingAtom)
  const signatureDesc = t('auth.sign')
  const signup = useSignup(signatureDesc, SERVER_URL)
  const provider = useProvider()
  const _toast = useToast()
  const toast = (s: string) => _toast(s, { position: 'top', duration: 2000 })
  const login = useLogin()
  const closeAuthModal = useCloseAuthModal()
  const router = useLocation()
  const navi = useNavigate()
  const lastConnector = useLastConectorName()
  const onSignZilpay = async (nonce: number) => {
    if (!zilpay.isConnected) {
      toast(t('auth.errors.wallet-not-connected'))
      return null
    }
    const message = buildSignMessage(nonce, signatureDesc)
    return zilpay.signMessage(message)
  }
  const setIsConnectingUD = useUpdateAtom(isConnectingUDAtom)
  const onSign = async (nonce: number) => {
    if (account.startsWith('zil')) {
      return onSignZilpay(nonce)
    }
    const message = buildSignMessage(nonce, signatureDesc)
    if (lastConnector === ConnectorName.JoyID) {
      const signature = await signMessage(message)
      return {
        message,
        signature,
      }
    }
    if (provider == null) {
      toast(t('auth.errors.wallet-not-connected'))
      return null
    }
    const signature = await provider.getSigner().signMessage(message)

    return {
      message,
      signature,
    }
  }

  const trackWhiteListConnect = useTrackClick(TrackEvent.WhiteListConnectWallet)
  const setTrackGlobal = useSetGlobalTrack()
  const onRemember = async () => {
    setIsLoading(true)
    try {
      const { nonce, error, code, signature, message, pubkey } = await signup()
      if (isCoinbaseWallet() && error) {
        throw new NoOnWhiteListError('Not on the white list')
      }
      switch (code) {
        case SignupResponseCode.Registered: {
          const signedData = await onSign(nonce!)
          if (signedData != null) {
            const { jwt } = await login(
              signedData.message,
              signedData.signature,
              (signedData as any).publicKey
            )
            closeAuthModal()
            await setTrackGlobal(jwt)
            if (router.pathname === RoutePath.WhiteList) {
              trackWhiteListConnect({ [TrackKey.WhiteListEntry]: true })
            }
            const [, pathname] = router.pathname.split('/')
            if (
              `/${pathname}` !== RoutePath.Subscribe &&
              `/${pathname}` !== RoutePath.SubscriptionArticle &&
              !isSupportedAddress(pathname) &&
              pathname !== ':id'
            ) {
              navi(RoutePath.Home)
            }
          }
          break
        }
        case SignupResponseCode.Success: {
          const { jwt } = await login(message!, signature!, pubkey)
          await setTrackGlobal(jwt)
          if (router.pathname === RoutePath.WhiteList) {
            trackWhiteListConnect({ [TrackKey.WhiteListEntry]: true })
          }
          closeAuthModal()
          const [, pathname] = router.pathname.split('/')
          if (
            `/${pathname}` !== RoutePath.WhiteList &&
            `/${pathname}` !== RoutePath.Subscribe &&
            `/${pathname}` !== RoutePath.SubscriptionArticle &&
            !isSupportedAddress(pathname)
          ) {
            navi(RoutePath.Setup)
          }
          break
        }
        case SignupResponseCode.ConditionNotMeet:
          if (router.pathname === RoutePath.WhiteList) {
            closeAuthModal()
            trackWhiteListConnect({ [TrackKey.WhiteListEntry]: false })
          } else if (router.pathname === RoutePath.Home) {
            closeAuthModal()
          } else {
            toast(t('auth.errors.condition-not-meet'))
          }
          break
        default:
          toast(
            error instanceof Error ? error?.message : t('auth.errors.unknown')
          )
          break
      }
      setIsConnectingUD(false)
    } catch (error: any) {
      if (error instanceof NoOnWhiteListError) {
        throw error
      }
      if (error?.code !== 4001) {
        if (typeof error === 'string' && error.includes('Rejected')) {
          return
        }
        toast(error?.message ?? t('auth.errors.unknown'))
      }
    } finally {
      setIsLoading(false)
    }
  }
  return {
    onRemember,
    isLoading,
  }
}
