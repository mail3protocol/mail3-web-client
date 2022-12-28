export namespace HomeCommunity {
  export interface MessageResp {
    uuid: string
    subject: string
    summary: string
    read_count: number
    created_at: string
  }

  export interface ListResp {
    messages: MessageResp[]
    next_cursor: string
  }
}
