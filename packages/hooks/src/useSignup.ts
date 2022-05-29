import { useCallback } from 'react'
import axios from 'axios'
import { useSignUpAPI } from './api'
import { useProvider } from './connectors'

export const buildSignMessaege = (nonce: number, desc: string) => `${desc}

Nonce: ${nonce}`

export enum SignupResponseCode {
  Registered = 200,
  Success = 201,
  ConditionNotMeet = 400,
  Failed = 401,
}

export const useGetNonce = (url: string) => {
  const api = useSignUpAPI(url)
  return useCallback(async () => {
    try {
      const { data } = await api.getNonce()
      return {
        nonce: data.nonce,
        isRegistered: true,
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error?.response?.data.metadata?.nonce) {
        return {
          nonce: error?.response?.data.metadata?.nonce as number,
          isRegistered: false,
        }
      }
      throw error
    }
  }, [api])
}

export const useSignup = (signatureDesc: string, serverURL: string) => {
  const api = useSignUpAPI(serverURL)
  const provider = useProvider()
  const getNonce = useGetNonce(serverURL)
  return useCallback(async () => {
    if (provider == null) {
      throw new Error('Please conenct a wallet')
    }
    const { isRegistered, nonce } = await getNonce()
    // if it's already registered, return code 200 and nonce
    if (isRegistered) {
      return {
        code: SignupResponseCode.Registered,
        nonce,
      }
    }
    const message = buildSignMessaege(nonce, signatureDesc)
    const signature = await provider.getSigner().signMessage(message)
    try {
      await api.signUp(message, signature)
    } catch (error) {
      if (axios.isAxiosError(error) && error?.response?.data.code === 400) {
        return {
          code: SignupResponseCode.ConditionNotMeet,
          error,
        }
      }
      // signup failed, return code 401 and error
      return {
        code: SignupResponseCode.Failed,
        error,
      }
    }
    // registered success return code 201 and nonce
    return {
      code: SignupResponseCode.Success,
      nonce,
      message,
      signature,
    }
  }, [api, provider, getNonce])
}
