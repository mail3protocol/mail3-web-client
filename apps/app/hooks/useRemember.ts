import { useTranslation } from 'react-i18next'
import {
  buildSignMessage,
  SignupResponseCode,
  TrackEvent,
  TrackKey,
  useAccount,
  useProvider,
  useSignup,
  useToast,
  useTrackClick,
  zilpay,
} from 'hooks'
import { useLocation, useNavigate } from 'react-router-dom'
import { atom, useAtom } from 'jotai'
import { useAtomValue } from 'jotai/utils'
import { SERVER_URL } from '../constants'
import { useCloseAuthModal, useLogin, useSetGlobalTrack } from './useLogin'
import { RoutePath } from '../route/path'
import { isCoinbaseWallet } from '../utils'

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
  const onSignZilpay = async (nonce: number) => {
    if (!zilpay.isConnected) {
      toast(t('auth.errors.wallet-not-connected'))
      return null
    }
    const message = buildSignMessage(nonce, signatureDesc)
    return zilpay.signMessage(message)
  }
  const onSign = async (nonce: number) => {
    if (account.startsWith('zil')) {
      return onSignZilpay(nonce)
    }
    if (provider == null) {
      toast(t('auth.errors.wallet-not-connected'))
      return null
    }
    const message = buildSignMessage(nonce, signatureDesc)
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
            if (router.pathname === RoutePath.Testing) {
              trackTestingConnect({ [TrackKey.TestingEntry]: true })
            }
            const [, pathname] = router.pathname.split('/')
            if (`/${pathname}` !== RoutePath.Subscribe) {
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
          if (router.pathname !== RoutePath.WhiteList) {
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
