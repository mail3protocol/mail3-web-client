import { atom, useAtom } from 'jotai'
import { useTranslation } from 'react-i18next'
import {
  buildSignMessage,
  SignupResponseCode,
  useProvider,
  useSignup,
  useToast,
} from 'hooks'
import { useNavigate } from 'react-router-dom'
import { SERVER_URL } from '../constants/env/url'
import { useLogin } from './useLogin'
import { RoutePath } from '../route/path'
import { useRegisterDialog } from './useRegisterDialog'

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

  const onSign = async (nonce: number) => {
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
      console.log(code)
      switch (code) {
        case SignupResponseCode.Registered: {
          const signedData = await onSign(nonce!)
          if (signedData) {
            await login(
              signedData.message,
              signedData.signature,
              (signedData as any).publicKey
            )
            navi(RoutePath.Dashboard)
          }
          break
        }
        case SignupResponseCode.Success: {
          await login(message!, signature!, pubkey)
          navi(RoutePath.Dashboard)
          break
        }
        case SignupResponseCode.ConditionNotMeet: {
          console.log(code)
          onOpenRegisterDialog()
          break
        }
        default:
          toast(
            error instanceof Error ? error?.message : t('auth.errors.unknown')
          )
          break
      }
    } catch (err) {
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
