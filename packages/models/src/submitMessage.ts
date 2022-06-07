export namespace SubmitMessage {
  export type ContentDisposition = 'inline' | 'attachment'
  export type ReferenceAction = 'forward' | 'reply'

  export enum Encoding {
    Base64 = 'base64',
  }
  export interface Address {
    name?: string
    address: string
  }

  export interface Attachment {
    filename?: string
    content: string // Base64 formatted attachment file
    contentType: string
    contentDisposition: ContentDisposition
    cid?: string
    encoding?: Encoding
  }

  export interface Reference {
    message: string
    action?: ReferenceAction
  }

  export interface RequestBody {
    reference?: Reference
    envelope?: {
      from: string
      to: string[]
    }
    from?: Address
    to?: Address[]
    cc?: Address[]
    bcc?: Address[]
    raw?: string
    subject: string
    text?: string
    html?: string
    attachments?: Attachment[]
    messageId?: string
    headers?: object
    trackingEnabled?: boolean
    copy?: boolean
    sendAt?: boolean
    deliveryAttempts?: number // How many delivery attempts to make until message is considered as failed
  }

  export interface Response {
    response: string
    messageId: string
    sendAt: string
    queueId: string
  }
}
