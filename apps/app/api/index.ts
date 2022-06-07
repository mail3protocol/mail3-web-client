import axios, { Axios, AxiosResponse } from 'axios'
import { SubmitMessage } from 'models/src/submitMessage'
import { UploadMessage } from 'models/src/uploadMessage'
import { GetMessage } from 'models/src/getMessage'
import { GetMessageContent } from 'models/src/getMessageContent'
import { SERVER_URL } from '../constants/env'

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
}
