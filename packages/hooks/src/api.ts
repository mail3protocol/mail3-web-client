import axios, { Axios, AxiosResponse } from 'axios'
import { useMemo } from 'react'
import { useAccount } from './connectors'

export class API {
  private address: string

  private axios: Axios

  constructor(account: string, baseURL: string) {
    this.address = account
    this.axios = axios.create({
      baseURL,
    })
    this.axios.interceptors.response.use(
      (res) => res,
      (error) => {
        throw error
      }
    )
  }

  public async getNonce(): Promise<AxiosResponse<{ nonce: number }>> {
    return this.axios.get(`/address_nonces/${this.address}`)
  }

  public async signUp(message: string, signature: string, pubkey?: string) {
    const data: Record<string, string> = {
      address: this.address,
      message,
      signature,
    }
    if (pubkey) {
      data.pubkey = pubkey
    }
    return this.axios.post('/registrations', data)
  }
}

export const useSignUpAPI = (url: string) => {
  const account = useAccount()
  return useMemo(() => new API(account, url), [account, url])
}
