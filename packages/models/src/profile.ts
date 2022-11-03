export namespace Profile {
  export interface getCommunityUserInfo {
    code: number
    msg: string
    data: {
      uuid: string
      eth: string
      score: number
      ranking: number
      poapList: [
        {
          name: string
          img: string
          hadGot: boolean
        }
      ]
    }
  }
}
