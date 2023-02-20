export interface MessageListResponse {
  messages: Message[] | null
  next_cursor: string
}

export enum MessageType {
  Premium = 'premium',
  Normal = 'normal',
}

export enum MessageSource {
  Mail3Community = 'mail3_community',
  MirrorPost = 'mirror_post',
}

export interface Message {
  created_at: string
  read_count: number
  subject: string
  uuid: string
  message_type: MessageType
  source: MessageSource
}
