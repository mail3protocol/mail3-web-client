export namespace SubmitMessage {
  export enum ReferenceAction {
    Forward = 'forward',
    Reply = 'reply',
  }

  export namespace AttachmentItem {
    export enum ContentDisposition {
      Inline = 'inline',
      Attachment = 'attachment',
    }

    export enum Encoding {
      Base64 = 'base64',
    }
  }

  export interface Address {
    name?: string
    address: string
  }

  export interface Attachment {
    filename?: string
    content: string // Base64 formatted attachment file
    contentType?: string
    contentDisposition?: AttachmentItem.ContentDisposition
    cid?: string
    encoding?: AttachmentItem.Encoding
  }

  export interface RequestBody {
    reference?: {
      message: string
      action?: ReferenceAction
    }
    envelope?: {
      from: string
      to: string[]
    }
    from?: Address
    to?: Address[]
    cc?: Address[]
    bcc?: Address[]
    raw?: string
    subject?: string
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
