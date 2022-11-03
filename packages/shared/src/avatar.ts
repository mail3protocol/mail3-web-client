import axios from 'axios'
import { CybertionConnect } from 'models'

export const cybertinoConnectAvatarQuery = (
  address: string,
  chain = 'ETH'
) => `query FullIdentityQuery {
  identity(
    address: "${address}"
    network: ${chain}
  ) {
    address
    domain
    avatar
    joinTime
  }
}`

export const getCybertinoConnect = (address: string) =>
  axios.post<CybertionConnect.GetCybertinoConnect>(
    'https://api.cybertino.io/connect/',
    JSON.stringify({ query: cybertinoConnectAvatarQuery(address) }),
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }
  )

export const generateAvatarSrc = (address: string) =>
  `https://source.boringavatars.com/marble/120/${address}?colors=92A1C6,146A7C,F0AB3D,C271B4,C20D90&square=false`

export const getMail3Avatar = (address: string) =>
  axios.get<{ avatar: string }>(
    `https://api.mail3.imibao.net/api/v1/avatar/${address}`
  )

export const getPrimitiveAddress = (domain: string) =>
  axios.get<{ eth_address: string }>(
    `https://api.mail3.imibao.net/api/v1/addresses/${domain}`
  )
