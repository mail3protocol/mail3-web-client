import axios, { AxiosInstance } from 'axios'
import { HOME_URL } from '../constants/env/url'

export enum UploadImageType {
  Normal = 'normal',
  Banner = 'banner',
}

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

  uploadImage(image: File, type?: UploadImageType) {
    const formData = new FormData()
    formData.set('image', image)
    formData.set('address', this.account)

    switch (type) {
      case UploadImageType.Banner:
        formData.set('type', UploadImageType.Banner)
        break

      default:
        break
    }

    return this.axios.post<{ url: string }>(`/community/upload_image`, formData)
  }
}
