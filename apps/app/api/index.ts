import axios, { Axios, AxiosResponse } from 'axios'
import { SERVER_URL } from '../constants/env'
import { mockENSNames } from '../mocks/ens'

export class API {
  private account: string

  private jwt: string

  private axios: Axios

  constructor(account = '', jwt = '') {
    this.account = account
    this.jwt = jwt
    this.axios = axios.create({
      baseURL: SERVER_URL,
      headers: {
        Authorization: `Bearer ${this.jwt}`,
      },
    })
  }

  public async getENSNames(): Promise<AxiosResponse<typeof mockENSNames>> {
    return this.axios.get(`/ens-names?address=${this.account}`)
  }

  public async setDefaultSentAddress(
    account: string
  ): Promise<AxiosResponse<void>> {
    return this.axios.post('/ens-names', {
      default_address: account,
      current_address: this.account,
    })
  }
}
