export interface NftDetail {
  name: string
  img: string
  hadGot: boolean
  poapPlatform: string
}

export interface ClusterInfoResp {
  code: number
  msg: string
  data: {
    uuid: string
    eth: string
    score: number
    ranking: number
    poapList: NftDetail[]
  }
}

export interface ClusterItemsDetail {
  name: string
  img: string
  poapPlatform: string
}

export interface ClusterCommunityResp {
  code: number
  msg: string
  data: {
    uuid: string
    poapList: ClusterItemsDetail[]
  }
}
