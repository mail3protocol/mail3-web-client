export interface UserInfoResponse {
  name: string
  address: string
}

export interface UserSettingResponse {
  banner_url: string
  description: string
  items_link: string
  mmb_state: string
  avatar: string
}

export interface UserSettingRequest {
  banner_url: string
  description: string
  items_link: string
  mmb_state: string
  avatar: string
}
