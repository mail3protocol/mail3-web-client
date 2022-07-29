export namespace CybertionConnect {
  export interface GetCybertinoConnect {
    identity: Identity
  }

  export interface Identity {
    address: string
    domain: string
    avatar: string
    joinTime: string
  }
}
