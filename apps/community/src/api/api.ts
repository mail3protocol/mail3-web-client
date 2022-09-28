import axios, { AxiosInstance } from 'axios'
import { CommunityConnectionResponse } from './modals/CommunityConnectionResponse'
import { SERVER_URL } from '../constants/env/url'

export class API {
  private readonly axios: AxiosInstance

  private account: string

  constructor(account = '') {
    this.axios = axios.create({ baseURL: SERVER_URL })
    this.account = account
  }

  get axiosInstance() {
    return this.axios
  }

  public getAddress() {
    return this.account
  }

  connection(
    message: string,
    signature: string,
    options?: {
      pubKey?: string
    }
  ) {
    return this.axios.post<CommunityConnectionResponse>(
      `/community/connection`,
      {
        address: this.account,
        message,
        signature,
        pub_key: options?.pubKey,
      }
    )
  }

  checkUser(address: string) {
    return this.axios.get(`/community/users/${address}`)
  }
}
