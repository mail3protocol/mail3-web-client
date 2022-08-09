import axios, { Axios, AxiosResponse } from 'axios'
import { SubmitMessage } from 'models/src/submitMessage'
import { UploadMessage } from 'models/src/uploadMessage'
import { GetMessage } from 'models/src/getMessage'
import { GetMessageContent } from 'models/src/getMessageContent'
import { noop } from 'hooks'
import { GetMessageEncryptionKeyResponse } from 'models/src/messageEncryptionKey'
import { MessageOnChainIdentifierResponse } from 'models/src/MessageOnChainIdentifier'
import { SERVER_URL } from '../constants/env'
import { Mailboxes } from './mailboxes'

type mailAddress = `${string}@${string}`

export interface LoginResponse {
  uuid: string
  jwt: string
}

export interface Alias {
  uuid: string
  address: mailAddress
  is_default: boolean
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

export interface UserResponse {
  user_uuid: string
  avatar: string
  text_signature: string
  text_sig_state: 'enabled' | 'disabled'
  card_sig_state: 'enabled' | 'disabled'
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
        Authorization: `Bearer ${this.jwt}`,
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

  public async getAliases(): Promise<AxiosResponse<AliasResponse>> {
    return this.axios.get(`/account/aliases`)
  }

  public async getUserInfo(): Promise<AxiosResponse<UserResponse>> {
    return this.axios.get(`/account/settings/info`)
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
}
