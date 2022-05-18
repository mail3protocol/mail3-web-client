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

export interface MailboxesMessagesResponse {
  messages: Array<any>
  page: number
  pages: number
  total: number
}

export interface AddressResponse {
  name: string
  address: string
}

export type AddressListResponse = Array<AddressResponse>

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

  public async getSignatures(): Promise<AxiosResponse<typeof mockSignatures>> {
    return this.axios.get(`/signatures?address=${this.account}`)
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

  public async setTextSignature(
    enable: boolean,
    text: string
  ): Promise<AxiosResponse<void>> {
    return this.axios.post(`/signatures`, {
      address: this.account,
      enable,
      type: 'text',
      text,
    })
  }

  public async setCardSignature(enable: boolean): Promise<AxiosResponse<void>> {
    return this.axios.post(`/signatures`, {
      address: this.account,
      enable,
      type: 'card',
    })
  }

  public async setDefaultSentAddress(
    account: string
  ): Promise<AxiosResponse<void>> {
    return this.axios.post('/ens-names', {
      default_address: account,
      current_address: this.account,
    })
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
}
