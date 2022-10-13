import axios, { AxiosInstance } from 'axios'
import { HOME_URL } from '../constants/env/url'

export class HomeAPI {
  private readonly axios: AxiosInstance

  private account: string

  private jwt: string

  constructor(account = '', jwt = '') {
    this.jwt = jwt
    this.account = account
    this.axios = axios.create({
      baseURL: `${HOME_URL}/api`,
      headers: {
        Authorization: `Bearer ${this.jwt}`,
      },
    })
  }

  get axiosInstance() {
    return this.axios
  }

  public getAddress() {
    return this.account
  }

  uploadImage(image: File) {
    const formData = new FormData()
    formData.set('image', image)
    formData.set('address', this.account)
    return this.axios.post<{ url: string }>(`/community/upload_image`, formData)
  }
}
