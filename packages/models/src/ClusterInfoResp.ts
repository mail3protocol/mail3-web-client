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
