export namespace HomeCommunity {
  export enum MessageType {
    Premium = 'premium',
    Normal = 'normal',
  }
  export interface MessageResp {
    uuid: string
    subject: string
    summary: string
    read_count: number
    created_at: string
    message_type: MessageType
  }

  export interface ListResp {
    messages: MessageResp[]
    next_cursor: string
  }
}
