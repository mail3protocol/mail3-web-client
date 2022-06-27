import { SubmitMessage } from './submitMessage'

export namespace UploadMessage {
  export interface RequestBody {
    path: string
    flags?: {
      add?: string[]
      delete?: string[]
      set?: string[]
    }
    labels?: {
      add?: string[]
      delete?: string[]
      set?: string[]
    }
    reference?: SubmitMessage.Reference
    from: SubmitMessage.Address
    to?: SubmitMessage.Address[]
    cc?: SubmitMessage.Address[]
    bcc?: SubmitMessage.Address[]
    subject?: string
    text?: string
    html?: string
    attachments?: SubmitMessage.Attachment[]
    messageId?: string
    headers?: object
  }

  export interface Response {
    id: string
    path: string
    uid: number
    seq: number
  }
}
