export namespace Subscription {
  export enum MessageType {
    Normal = 'normal',
    Premium = 'premium',
  }
  export interface MessageResp {
    uuid: string
    subject: string
    writer: string
    seen: boolean
    created_at: string
    message_type: MessageType
  }

  export interface MessageStatsResp {
    unread_count: number
  }

  export interface MessageListResp {
    messages: MessageResp[]
    next_cursor: string
  }

  export interface MessageDetailResp {
    uuid: string
    subject: string
    writer_name: string
    writer_uuid: string
    content: string
    created_at: string
    summary: string
    message_type: MessageType
    dot_bit_account: string
  }

  export interface MessagesReq {
    cursor: string
    count: number
  }
}
