import { atom, useAtom } from 'jotai'
import { useTranslation } from 'react-i18next'
import {
  buildSignMessage,
  SignupResponseCode,
  useAccount,
  useProvider,
  useSignup,
  useToast,
  zilpay,
} from 'hooks'
import { useNavigate } from 'react-router-dom'
import { useUpdateAtom } from 'jotai/utils'
import { SERVER_URL } from '../constants/env/url'
import { useLogin, useSetGlobalTrack, isConnectingUDAtom } from './useLogin'
import { RoutePath } from '../route/path'
import { useRegisterDialog } from './useRegisterDialog'
import { API } from '../api/api'
import { SubscriptionState } from '../api/modals/SubscriptionResponse'
import { ErrorCode } from '../api/ErrorCode'

export const rememberLoadingAtom = atom(false)

export function useRemember() {
  const { t } = useTranslation('common')
  const [isLoading, setIsLoading] = useAtom(rememberLoadingAtom)
  const signatureDesc = t('auth.sign')
  const signup = useSignup(signatureDesc, SERVER_URL)
  const provider = useProvider()
  const _toast = useToast()
  const toast = (s: string) => _toast(s, { position: 'top', duration: 2000 })
  const navi = useNavigate()
  const login = useLogin()
  const onOpenRegisterDialog = useRegisterDialog()
  const account = useAccount()
  const setTrackGlobal = useSetGlobalTrack()
  const setIsConnectingUD = useUpdateAtom(isConnectingUDAtom)

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

  const onRemember = async () => {
    setIsLoading(true)
    try {
      const { nonce, error, code, signature, message, pubkey } = await signup()
      switch (code) {
        case SignupResponseCode.Registered: {
          const signedData = await onSign(nonce!)
          if (signedData) {
            const { jwt } = await login(
              signedData.message,
              signedData.signature,
              (signedData as any).publicKey
            )
            const api = new API(account, jwt)
            const earnNftState = await api
              .getSubscription()
              .then((r) => r.data.state)
            await setTrackGlobal()
            if (earnNftState === SubscriptionState.Active) {
              navi(RoutePath.Dashboard)
            } else {
              navi(RoutePath.EarnNft)
            }
          }
          break
        }
        case SignupResponseCode.Success: {
          await login(message!, signature!, pubkey)
          await setTrackGlobal()
          navi(RoutePath.Dashboard)
          break
        }
        case SignupResponseCode.ConditionNotMeet: {
          onOpenRegisterDialog()
          break
        }
        default:
          toast(
            error instanceof Error ? error?.message : t('auth.errors.unknown')
          )
          break
      }
      setIsConnectingUD(false)
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || err?.message || t('unknown_error')
      if (
        [
          ErrorCode.USER_NOT_FOUND,
          ErrorCode.COMMUNITY_ADDRESS_NOT_IN_WHITELIST,
        ].includes(err?.response?.data?.reason)
      ) {
        onOpenRegisterDialog({ reason: err?.response?.data?.reason })
      } else {
        toast(errorMessage)
      }
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    onRemember,
    isLoading,
  }
}
