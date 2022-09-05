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
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { SERVER_URL } from '../constants'
import { useCloseAuthModal, useLogin, useSetGlobalTrack } from './useLogin'
import { RoutePath } from '../route/path'

export function useRemember() {
  const [t] = useTranslation('common')
  const account = useAccount()
  const [isLoading, setIsLoading] = useState(false)
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
  const trackTestingConnect = useTrackClick(TrackEvent.TestingConnectWallet)
  const setTrackGlobal = useSetGlobalTrack()
  const onRemember = async () => {
    setIsLoading(true)
    try {
      const { nonce, error, code, signature, message, pubkey } = await signup()
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
            navi(RoutePath.Home)
          }
          break
        }
        case SignupResponseCode.Success: {
          const { jwt } = await login(message!, signature!, pubkey)
          await setTrackGlobal(jwt)
          if (router.pathname === RoutePath.WhiteList) {
            trackWhiteListConnect({ [TrackKey.WhiteListEntry]: true })
          }
          if (router.pathname === RoutePath.Testing) {
            trackTestingConnect({ [TrackKey.TestingEntry]: true })
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
          } else if (router.pathname === RoutePath.Testing) {
            closeAuthModal()
            trackTestingConnect({ [TrackKey.TestingEntry]: false })
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
