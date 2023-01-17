import axios, { AxiosInstance } from 'axios'
import { ConnectionResponse } from './modals/ConnectionResponse'
import { SERVER_URL } from '../constants/env/url'
import {
  UserInfoResponse,
  UserSettingRequest,
  UserSettingResponse,
} from './modals/UserInfoResponse'
import { MessageListResponse } from './modals/MessageListResponse'
import { StatisticsResponse } from './modals/StatisticsResponse'
import { SubscribersResponse } from './modals/SubscribersResponse'
import {
  SubscriptionRequest,
  UpdateSubscriptionResponse,
} from './modals/UpdateSubscriptionResponse'
import { SubscriptionResponse } from './modals/SubscriptionResponse'
import { PagingRequest } from './modals/base'

export class API {
  private readonly axios: AxiosInstance

  private account: string

  private jwt: string

  constructor(account = '', jwt = '') {
    this.jwt = jwt
    this.account = account
    this.axios = axios.create({
      baseURL: SERVER_URL,
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

  connection(
    message: string,
    signature: string,
    options?: {
      pubKey?: string
    }
  ) {
    return this.axios.post<ConnectionResponse>(`/community/connection`, {
      address: this.account,
      message,
      signature,
      pub_key: options?.pubKey,
    })
  }

  checkUser(address: string) {
    return this.axios.get(`/community/users/${address}`)
  }

  getUserInfo() {
    return this.axios.get<UserInfoResponse>(`/community/user_info`)
  }

  updateUserSetting(body: UserSettingRequest) {
    return this.axios.put<void>(`/community/user_setting`, body)
  }

  getUserSetting() {
    return this.axios.get<UserSettingResponse>(
      `/public/community/user_setting/${this.account}`
    )
  }

  getMessageList(queryParams: PagingRequest) {
    return this.axios.get<MessageListResponse>(`/community/messages`, {
      params: queryParams,
    })
  }

  getStatistics() {
    return this.axios.get<StatisticsResponse>(`/community/statistics`)
  }

  getSubscribers(queryParams: PagingRequest) {
    return this.axios.get<SubscribersResponse>(`/community/subscribers`, {
      params: queryParams,
    })
  }

  getSubscription() {
    return this.axios.get<SubscriptionResponse>(`/community/subscription`)
  }

  updateSubscription(body: SubscriptionRequest) {
    return this.axios.put<UpdateSubscriptionResponse>(
      `/community/subscription`,
      body
    )
  }

  sendMessage(subject: string, content: string, abstract: string) {
    return this.axios.post<{ uuid: string }>(`/community/message`, {
      subject,
      content,
      summary: abstract,
    })
  }
}
