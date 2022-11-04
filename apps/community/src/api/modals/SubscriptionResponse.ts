/*
UpdateCommunitySubscriptionReq {
  CampaignUrl string `json:"campaign_url"`
  RewardType string `json:"reward_type,options=nft"`
  platform string `json:"platform,options=galaxy|quest3"`
  CampaignId string `json:"campaign_id"`
  Key string `json:"key"`
  State string `json:"state,options=active|inactive"`
}

*/

export enum SubscriptionRewardType {
  NFT = 'nft',
}

export enum SubscriptionPlatform {
  Galaxy = 'galaxy',
  Quest3 = 'quest3',
}

export enum SubscriptionState {
  Active = 'active',
  Inactive = 'inactive',
}

export interface SubscriptionResponse {
  campaign_url: string
  credential_id: string
  key: string
  platform: SubscriptionPlatform
  reward_type: SubscriptionRewardType
  state: SubscriptionState
}
