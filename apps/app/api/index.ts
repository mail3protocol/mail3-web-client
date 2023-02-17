/* eslint-disable no-promise-executor-return */
import axios, { Axios, AxiosResponse } from 'axios'
import { SubmitMessage } from 'models/src/submitMessage'
import { UploadMessage } from 'models/src/uploadMessage'
import { CommunitySubscriptionResp, RewardType } from 'models/src/subscribe'
import { GetMessage } from 'models/src/getMessage'
import { GetMessageContent } from 'models/src/getMessageContent'
import { noop } from 'hooks'
import { GetMessageEncryptionKeyResponse } from 'models/src/messageEncryptionKey'
import { MessageOnChainIdentifierResponse } from 'models/src/MessageOnChainIdentifier'
import { HomeCommunity, Subscription, GetAliasResponse } from 'models'
import { SERVER_PV_AUTH_TOKEN, SERVER_URL } from '../constants/env'
import { Mailboxes } from './mailboxes'

export interface LoginResponse {
  uuid: string
  jwt: string
}

export enum MessageFlagType {
  Answered = '\\Answered ',
  Flagged = '\\Flagged',
  Deleted = '\\Deleted',
  Seen = '\\Seen',
  Draft = '\\Draft',
}

export enum MessageFlagAction {
  add = 'add',
  del = 'del',
  set = 'set',
}

export interface AddressResponse {
  name?: string
  address: string
}

export interface UserSettingResponse {
  banner_url: string
  description: string
  items_link: string
  mmb_state: 'enabled' | 'disabled'
  reward_type: RewardType
}

export type AddressListResponse = Array<AddressResponse>

export interface MailboxMessageItemResponse {
  id: string
  uid: string
  subject: string
  unseen: boolean
  messageId: string
  date: string
  from: AddressResponse
  to: AddressListResponse | null
  emailId: string
  threadId: string
  flagged: boolean
  size: number
  cc: AddressListResponse | null
  bcc: AddressListResponse | null
  inReplyTo: string
  flags: Array<Partial<MessageFlagType>> | null
  labels: Array<any> | null
  attachments: AttachmentItemResponse[] | null
  text: {
    id: string
    encodedSize: {
      plan: number
      html: number
    }
  }
  bounces: Array<any> | null
}

export interface MailboxesMessagesResponse {
  messages: Array<MailboxMessageItemResponse>
  page: number
  pages: number
  total: number
}

export interface AttachmentItemResponse {
  id: string
  contentType: string
  encodedSize: number
  filename: string
  embedded: boolean
  inline: boolean
  contentId: string
}

export interface MailboxMessageDetailResponse
  extends MailboxMessageItemResponse {}

export enum UserRole {
  Experience = 0,
  FullFeatured = 1,
}

export interface UserResponse {
  user_uuid: string
  avatar: string
  text_signature: string
  text_sig_state: 'enabled' | 'disabled'
  card_sig_state: 'enabled' | 'disabled'
  web_push_notification_state: 'enabled' | 'disabled'
  user_role: UserRole
  nickname: string
}

interface putMessageResponse {
  flags: { add: boolean; delete: boolean; set: boolean }
  labels: { add: boolean; delete: boolean; set: boolean }
}

interface moveMessageResponse {
  path: Mailboxes
  id: string
  uid: number
}

export class API {
  private account: string

  private jwt: string

  private axios: Axios

  constructor(account = '', jwt = '', clearCookie: () => void = noop) {
    this.account = account
    this.jwt = jwt
    this.axios = axios.create({
      baseURL: SERVER_URL,
      headers: {
        ...(this.jwt
          ? {
              Authorization: `Bearer ${this.jwt}`,
            }
          : {}),
      },
    })
    this.axios.interceptors.response.use(
      (res) => res,
      (error: any) => {
        const res = error?.response
        if (res.status === 401 && res.statusText === 'Unauthorized') {
          clearCookie()
        }
        throw error
      }
    )
  }

  public getAddress() {
    return this.account
  }

  public async getAliases(): Promise<AxiosResponse<GetAliasResponse>> {
    return this.axios.get(`/account/aliases`)
  }

  public async getUserInfo(): Promise<AxiosResponse<UserResponse>> {
    return this.axios.get(`/account/settings/info`)
  }

  public async updateRegistrationToken(
    token: string,
    state: 'stale' | 'active'
  ) {
    return this.axios.put(
      `/account/settings/notification/registration_tokens`,
      {
        token,
        state,
      }
    )
  }

  public switchUserWebPushNotification(state: 'stale' | 'active') {
    return this.axios.put(
      `/account/settings/web_push_notification_state_switches`,
      { state }
    )
  }

  public getRegistrationTokenState(token: string) {
    return this.axios.get<{
      state: 'stale' | 'active'
    }>(`/account/settings/notification/registration_tokens/${token}`)
  }

  public async login(
    message: string,
    signature: string,
    pubkey?: string
  ): Promise<AxiosResponse<LoginResponse>> {
    return this.axios.post('/sessions', {
      message,
      signature,
      address: this.account,
      pub_key: pubkey,
    })
  }

  public async setTextSignature(text: string): Promise<AxiosResponse<void>> {
    return this.axios.put(`/account/settings/text_signatures`, {
      text_signature: text,
    })
  }

  public async toggleTextSignature(): Promise<AxiosResponse<void>> {
    return this.axios.put('/account/settings/text_sig_state_switches')
  }

  public async toggleCardSignature(): Promise<AxiosResponse<void>> {
    return this.axios.put(`/account/settings/card_sig_state_switches`)
  }

  public async setDefaultSentAddress(
    uuid: string
  ): Promise<AxiosResponse<void>> {
    return this.axios.put(`/account/default_aliases/${uuid}`)
  }

  public async setProfile(
    nickname: string,
    avatar: string
  ): Promise<AxiosResponse<void>> {
    return this.axios.put(`/account/settings/user_info`, {
      nickname,
      avatar,
    })
  }

  public async submitMessage(body: SubmitMessage.RequestBody) {
    return this.axios.post<SubmitMessage.Response>(
      `/mailbox/account/submit`,
      body
    )
  }

  public uploadMessage(body: UploadMessage.RequestBody) {
    return this.axios.post<UploadMessage.Response>(
      `/mailbox/account/message`,
      body
    )
  }

  public deleteMessage(messageId: string, params?: { force?: boolean }) {
    return this.axios.delete<{
      deleted: boolean
      moved: {
        destination: string
        message: string
      }
    }>(`/mailbox/account/message/${messageId}`, {
      params,
    })
  }

  public async getMessageInfo(messageId: string) {
    return this.axios.get<GetMessage.Response>(
      `/mailbox/account/message/${messageId}`
    )
  }

  public async getMessageContent(textId: string) {
    return this.axios.get<GetMessageContent.Response>(
      `/mailbox/account/text/${textId}`
    )
  }

  // Lists all available mailboxes, not use for now.
  // public async getMailboxes(): Promise<AxiosResponse<void>> {
  //   return this.axios.get('/mailbox/account/mailboxes')
  // }

  public async getMailboxesMessages(
    path: string,
    page: number,
    pageSize: number = 20
  ): Promise<AxiosResponse<MailboxesMessagesResponse>> {
    return this.axios.get('/mailbox/account/messages', {
      params: {
        path,
        pageSize,
        page,
      },
    })
  }

  public async getMessagesSearch(
    path: string,
    page: number,
    search: Object,
    pageSize: number = 20
  ): Promise<AxiosResponse<MailboxesMessagesResponse>> {
    return this.axios.post('/mailbox/account/search', {
      path,
      pageSize,
      page,
      search,
    })
  }

  public async getMessagesNew(
    page: number,
    pageSize: number = 20
  ): Promise<AxiosResponse<MailboxesMessagesResponse>> {
    return this.axios.post('/mailbox/account/search', {
      path: Mailboxes.INBOX,
      pageSize,
      page,
      search: {
        unseen: true,
      },
    })
  }

  public async getUnreadMessagesCount(
    fromAddress: string
  ): Promise<AxiosResponse<MailboxesMessagesResponse>> {
    return this.axios.post('/mailbox/account/search', {
      path: Mailboxes.INBOX,
      pageSize: 20,
      page: 0,
      search: {
        unseen: true,
        from: fromAddress,
      },
    })
  }

  public async getMessagesSeen(
    page: number,
    pageSize: number = 20
  ): Promise<AxiosResponse<MailboxesMessagesResponse>> {
    return this.axios.post('/mailbox/account/search', {
      path: Mailboxes.INBOX,
      pageSize,
      page,
      search: {
        seen: true,
      },
    })
  }

  public async putMessage(
    messageId: string,
    action: MessageFlagAction,
    flagType: MessageFlagType
  ): Promise<AxiosResponse<putMessageResponse>> {
    return this.axios.put(`/mailbox/account/message/${messageId}`, {
      flags: {
        [action]: [flagType],
      },
    })
  }

  public async batchUpdateMessage(
    messageIds: string[],
    action: MessageFlagAction,
    flagType: MessageFlagType
  ): Promise<AxiosResponse<putMessageResponse>> {
    return this.axios.post(`/mailbox/account/messages/batch_update`, {
      messageIds,
      flags: {
        [action]: [flagType],
      },
    })
  }

  public async moveMessage(
    messageId: string,
    path: Mailboxes
  ): Promise<AxiosResponse<moveMessageResponse>> {
    return this.axios.put(`/mailbox/account/message/${messageId}/move`, {
      path,
    })
  }

  public async batchMoveMessage(
    ids: string[],
    path: string
  ): Promise<AxiosResponse<void>> {
    return this.axios.put('/mailbox/account/messages/batch_move', {
      messageIds: ids,
      path,
    })
  }

  public async batchDeleteMessage(
    ids: string[],
    isForce?: boolean
  ): Promise<AxiosResponse<void>> {
    return this.axios.post('/mailbox/account/messages/batch_delete', {
      messageIds: ids,
      force: isForce,
    })
  }

  public async downloadAttachment(
    messageId: string,
    attachmentId: string
  ): Promise<AxiosResponse<Blob>> {
    return this.axios.get(`/mailbox/account/attachment/${attachmentId}`, {
      params: {
        messageId,
      },
      responseType: 'blob',
    })
  }

  public async applyToExperienceNewFeature(featureName: 'community-mail') {
    return this.axios.post(`/account/feature_experiences/${featureName}`)
  }

  public async updateAliasEnsList() {
    return this.axios.put(`/account/aliases`)
  }

  public async updateAliasBitList() {
    return this.axios.put(`/account/dot_bit_aliases`)
  }

  public async updateAliasUDList() {
    return this.axios.put(`/account/unstoppable_aliases`)
  }

  public updateMessageEncryptionKey(messageEncryptionKey: string) {
    return this.axios.put('/account/settings/message_encryption_keys', {
      message_encryption_key: messageEncryptionKey,
    })
  }

  public getMessageEncryptionKeyState() {
    return this.axios.get<GetMessageEncryptionKeyResponse>(
      '/account/settings/message_encryption_key_states'
    )
  }

  public getMessageOnChainIdentifier(messageId: string) {
    return this.axios.get<MessageOnChainIdentifierResponse>(
      `/mailbox/account/messages/${messageId}/on_chain_identifier`
    )
  }

  public getSubscribePageIpfsInfo(messageId: string) {
    return this.axios.get<MessageOnChainIdentifierResponse>(
      `/public/community/message_on_chain_identifiers/${messageId}`
    )
  }

  public async getSubscribeStatus(
    userId: string
  ): Promise<AxiosResponse<CommunitySubscriptionResp>> {
    return this.axios.get(`/subscription/followings/${userId}`)
  }

  public async putSubscribeCampaign(
    userId: string,
    state: 'active' | 'inactive' = 'active'
  ): Promise<AxiosResponse<CommunitySubscriptionResp>> {
    return this.axios.post(
      `/subscription/community_users/${userId}/following`,
      {
        uuid: userId,
        state,
      }
    )
  }

  public async SubscriptionMessages(nextCursor: string) {
    return this.axios.get<Subscription.MessageListResp>(
      `/subscription/messages/?cursor=${nextCursor}&count=20`
    )
  }

  public async SubscriptionMessageDetail(uuid: string) {
    return this.axios.get<Subscription.MessageDetailResp>(
      `/subscription/messages/${uuid}`
    )
  }

  public async SubscriptionCommunityUserFollowing(uuid: string) {
    return this.axios.post<void>(
      `/subscription/community_users/${uuid}/following`
    )
  }

  public async SubscriptionCommunityUserUnFollowing(uuid: string) {
    return this.axios.delete<void>(
      `/subscription/community_users/${uuid}/following`
    )
  }

  public async SubscriptionMessageStats() {
    return this.axios.get<Subscription.MessageStatsResp>(
      `/subscription/message_stats`
    )
  }

  public async checkPremiumMember(uuid: string) {
    return this.axios.get<void>(`/subscription/premium_members/${uuid}`)
  }

  public async checkIsProject(address: string) {
    return this.axios.get(`/community/users/${address}`)
  }

  public async getPrimitiveAddress(domain: string) {
    return this.axios.get(`/addresses/${domain}`)
  }

  public async getUserSetting(account: string) {
    return this.axios.get<UserSettingResponse>(
      `/public/community/user_setting/${account}`
    )
  }

  public async getCommunityMessages(address: string, nextCursor: string) {
    return this.axios.get<HomeCommunity.ListResp>(
      `/public/community/messages/${address}/?cursor=${nextCursor}&count=20`
    )
  }

  public async getSubscribeUserInfo(address: string) {
    return this.axios.get<{ nickname: string; avatar: string }>(
      `/user_info/${address}`
    )
  }

  public async postStatsEvents({
    type = 'read_community_message',
    uuid,
  }: {
    type?: string
    uuid: string
  }) {
    return this.axios.post<void>(`/stats/events`, {
      event_type: type,
      uuid,
      auth_token: SERVER_PV_AUTH_TOKEN,
    })
  }
}
