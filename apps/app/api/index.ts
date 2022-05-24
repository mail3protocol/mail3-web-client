import axios, { Axios, AxiosResponse } from 'axios'
import { SERVER_URL } from '../constants/env'
import { mockSignatures } from '../mocks/signature'
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

export interface MessageItemResponse {
  id: string
  uid: string
  subject: string
  unseen: boolean
  messageId: string
  date: string
  from: AddressResponse
  to: AddressListResponse
}
export interface MailboxesMessagesResponse {
  messages: Array<MessageItemResponse>
  page: number
  pages: number
  total: number
}

export interface AddressResponse {
  name: string
  address: string
}

export enum FlagType {
  Answered = '\\Answered ',
  Flagged = '\\Flagged',
  Deleted = '\\Deleted',
  Seen = '\\Seen',
  Draft = '\\Draft',
}

export enum FlagAction {
  add = 'add',
  del = 'del',
  set = 'set',
}

export type AddressListResponse = Array<AddressResponse>

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

  public async getAliaes(): Promise<AxiosResponse<AliasResponse>> {
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
    return this.axios.post(`/account/default_aliases/${uuid}`)
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

  public async deleteMessage(messageId: string): Promise<AxiosResponse<any>> {
    return this.axios.delete(`/mailbox/account/message/${messageId}`)
  }

  public async putMessage(
    messageId: string,
    action: FlagAction,
    flagType: FlagType
  ): Promise<AxiosResponse<any>> {
    return this.axios.put(`/mailbox/account/message/${messageId}`, {
      flags: {
        [action]: [flagType],
      },
    })
  }
}
