export interface UserSettingResponse {
  banner_url: string
  description: string
  items_link: string
  mmb_state: string
  avatar: string
  nickname: string
  manager_default_alias: string
}

export interface UserSettingRequest {
  banner_url: string
  description: string
  items_link: string
  mmb_state: string
  avatar: string
  nickname: string
}
