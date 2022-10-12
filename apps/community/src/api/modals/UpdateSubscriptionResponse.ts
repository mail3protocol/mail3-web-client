import {
  SubscriptionPlatform,
  SubscriptionRewardType,
  SubscriptionState,
} from './SubscriptionResponse'

export interface UpdateSubscriptionResponse {
  uuid: string
}

export interface SubscriptionRequest {
  campaign_url?: string
  reward_type?: SubscriptionRewardType
  platform?: SubscriptionPlatform
  credential_id?: string
  key?: string
  state?: SubscriptionState
}
