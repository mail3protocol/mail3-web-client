import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { GetMessageEncryptionKeyResponse } from 'models/src/messageEncryptionKey'
import { CheckMessageQuotaResponse, GetAliasResponse } from 'models'
import { ConnectionResponse } from './modals/ConnectionResponse'
import { SERVER_URL } from '../constants/env/url'
import {
  UserInfoResponse,
  UserSettingRequest,
  UserSettingResponse,
} from './modals/UserInfoResponse'
import { MessageListResponse, MessageType } from './modals/MessageListResponse'
import { StatisticsResponse } from './modals/StatisticsResponse'
import { SubscribersResponse } from './modals/SubscribersResponse'
import {
  SubscriptionRequest,
  UpdateSubscriptionResponse,
} from './modals/UpdateSubscriptionResponse'
import { SubscriptionResponse } from './modals/SubscriptionResponse'
import { PagingRequest } from './modals/base'
import {
  UserPremiumSettingRequest,
  UserPremiumSettingResponse,
  UserPremiumSettingState,
} from './modals/UserPremiumSetting'
import { CommunityCollaboratorsResp } from './modals/co-authors'

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

  sendMessage(
    subject: string,
    content: string,
    summary: string,
    options?: {
      messageType: MessageType
    }
  ) {
    return this.axios.post<{ uuid: string }>(`/community/message`, {
      subject,
      content,
      summary,
      message_type: options?.messageType || MessageType.Normal,
    })
  }

  updateUserPremiumSettings(
    dotBitAccount: string,
    options?: {
      state: UserPremiumSettingState
    }
  ) {
    return this.axios.put<
      UserPremiumSettingResponse,
      AxiosResponse<UserPremiumSettingResponse>,
      UserPremiumSettingRequest
    >(`/community/premium_setting`, {
      dot_bit_account: dotBitAccount,
      state: options?.state,
    })
  }

  getUserPremiumSettings() {
    return this.axios.get<UserPremiumSettingResponse>(
      `/community/premium_setting`
    )
  }

  getCollaborators() {
    return this.axios.get<CommunityCollaboratorsResp>(
      `/community/collaborators`
    )
  }

  bindCollaborators(address: string) {
    return this.axios.post(`/community/collaborators/bind`, {
      address,
    })
  }

  unbindCollaborators(address: string) {
    return this.axios.post(`/community/collaborators/unbind`, {
      address,
    })
  }

  public switchFromMirror() {
    return this.axios.post(`/community/mirror_post_sync_events`)
  }

  public updateMessageEncryptionKey(messageEncryptionKey: string) {
    return this.axios.put('/account/settings/message_encryption_keys', {
      message_encryption_key: messageEncryptionKey,
    })
  }

  public getMessageEncryptionKeyState() {
    return this.axios.get<GetMessageEncryptionKeyResponse>(
      '/community/message_encryption_key_states'
    )
  }

  public async getAliases() {
    return this.axios.get<GetAliasResponse>(`/account/aliases`)
  }

  public async checkMessageQuota() {
    return this.axios.get<CheckMessageQuotaResponse>(
      `/community/check_message_quota`
    )
  }
}
