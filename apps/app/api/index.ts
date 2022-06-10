import axios, { Axios, AxiosResponse } from 'axios'
import { SubmitMessage } from 'models/src/submitMessage'
import { UploadMessage } from 'models/src/uploadMessage'
import { GetMessage } from 'models/src/getMessage'
import { GetMessageContent } from 'models/src/getMessageContent'
import { SERVER_URL } from '../constants/env'
import { Mailboxes } from './mailboxes'

export interface LoginResponse {
  uuid: string
  jwt: string
}

export interface Alias {
  uuid: string
  address: string
  is_default: string
}

export interface AliasResponse {
  aliases: Alias[]
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

export type AddressListResponse = Array<AddressResponse>

export interface MailboxMessageItemResponse {
  id: string
  uid: string
  subject: string
  unseen: boolean
  messageId: string
  date: string
  from: AddressResponse
  to: AddressListResponse
  emailId: string
  threadId: string
  flagged: boolean
  size: number
  cc: Array<AddressResponse> | null
  bcc: Array<AddressResponse> | null
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

export interface UserResponse {
  user_uuid: string
  avatar: string
  text_signature: string
  text_sig_state: 'enabled' | 'disabled'
  card_sig_state: 'enabled' | 'disabled'
}

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

  public getAddress() {
    return this.account
  }

  public async getAliases(): Promise<AxiosResponse<AliasResponse>> {
    return this.axios.get(`/account/aliases`)
  }

  public async getUserInfo(): Promise<AxiosResponse<UserResponse>> {
    return this.axios.get(`/account/settings/info`)
  }

  public async login(
    message: string,
    signature: string
  ): Promise<AxiosResponse<LoginResponse>> {
    return this.axios.post('/sessions', {
      message,
      signature,
      address: this.account,
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

  public async getMailboxes(): Promise<AxiosResponse<void>> {
    return this.axios.get('/mailbox/account/mailboxes')
  }

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

  public async getMessageData(messageId: string): Promise<AxiosResponse<any>> {
    return this.axios.get(`/mailbox/account/message/${messageId}`)
  }

  public async getTextData(textId: string): Promise<AxiosResponse<any>> {
    return this.axios.get(`/mailbox/account/text/${textId}`)
  }

  public async deleteMessage2(
    messageId: string,
    isForce = false
  ): Promise<AxiosResponse> {
    return this.axios.delete(`/mailbox/account/message/${messageId}`, {
      data: {
        force: isForce,
      },
    })
  }

  public async putMessage(
    messageId: string,
    action: MessageFlagAction,
    flagType: MessageFlagType
  ): Promise<AxiosResponse<any>> {
    return this.axios.put(`/mailbox/account/message/${messageId}`, {
      flags: {
        [action]: [flagType],
      },
    })
  }

  public async moveMessage(messageId: string): Promise<AxiosResponse<any>> {
    return this.axios.put(`/mailbox/account/message/${messageId}/move`, {
      path: Mailboxes.INBOX,
    })
  }

  public async batchDeleteMessage(
    ids: string[],
    isForce?: boolean
  ): Promise<AxiosResponse> {
    return this.axios.post('/mailbox/account/messages/batch_delete', {
      messageIds: ids,
      force: isForce,
    })
  }

  public async downloadAttachment(
    messageId: string,
    attachmentId: string
  ): Promise<AxiosResponse> {
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
}
