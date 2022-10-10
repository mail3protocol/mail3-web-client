export interface MessageListResponse {
  messages: Message[]
  next_cursor: string
}

export interface Message {
  created_at: string
  read_count: number
  subject: string
  uuid: string
}
