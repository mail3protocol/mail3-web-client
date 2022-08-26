import { SubmitMessage } from './submitMessage'

export namespace GetMessage {
  export interface Bounces {
    message: string
    recipient?: string
    action: string
    response: {
      message: string
      status: string
    }
    date: string
  }

  export interface Attachment {
    contentId: string
    contentType: string
    embedded: boolean
    encodedSize: number
    filename: string
    id: string
    inline: boolean
  }

  export interface Response {
    id: string
    uid: number
    emailId: string
    threadId: string
    date: string
    draft: boolean
    unseen: boolean
    flagged: boolean
    size: number
    subject: string
    from: SubmitMessage.Address
    to: SubmitMessage.Address[] | null
    cc: SubmitMessage.Address[] | null
    bcc: SubmitMessage.Address[] | null
    messageId: string
    flags: string[]
    labels: string[] | null
    attachments: Attachment[]
    text: {
      id: string
      hasMore: boolean
      encodedSize: {
        plan: number
        html: number
      }
      plain: string
      html: string
    }
    bounces: Bounces[] | null
    isAutoReply?: boolean
    headers: {
      'x-spam-flag'?: string[]
    }
  }
}
