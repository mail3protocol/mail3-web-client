export interface CommunitySubscriptionResp {
  campaign_url: string
  reward_type: string
  platform: 'galaxy' | 'quest3'
  campaign_id: string
  state: 'active' | 'inactive'
}

export enum RewardType {
  NFT = 'nft',
  AIR = 'air',
}
