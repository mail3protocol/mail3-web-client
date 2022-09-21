export namespace Subscription {
  export interface MessageResp {
    uuid: string
    subject: string
    writer: string
    seen: boolean
    created_at: string
  }

  export interface MessageListResp {
    messages: MessageResp[]
    page: number
    pages: number
    total: number
  }

  export interface MessageDetailResp {
    uuid: string
    subject: string
    writer_name: string
    writer_uuid: string
    content: string
    created_at: string
  }

  export interface MessagesReq {
    cursor: string
    count: number
  }
}
