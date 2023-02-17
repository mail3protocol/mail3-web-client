export enum UserPremiumSettingState {
  Disabled = 'disabled',
  Enabled = 'enabled',
}

export interface UserPremiumSettingRequest {
  dot_bit_account: string
  state?: UserPremiumSettingState
}

export interface UserPremiumSettingResponse {
  dot_bit_account: string
  state: UserPremiumSettingState
}
