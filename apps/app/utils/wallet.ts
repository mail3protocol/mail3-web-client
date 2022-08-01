import { IS_MOBILE } from '../constants'
import { isImToken } from './env'

const generateCurrentURL = () =>
  `${window.location.host}${
    window.location.pathname !== '/' ? window.location.pathname : ''
  }`

export const generateMetamaskDeepLink = () =>
  `https://metamask.app.link/dapp/${generateCurrentURL()}`

export const generateTrustWalletDeepLink = () =>
  `https://link.trustwallet.com/open_url?coin_id=60&url=https://${generateCurrentURL()}`

export const generateImtokenDeepLink = () =>
  !IS_MOBILE
    ? `https://token.im/download`
    : `imtokenv2://navigate/DappView?url=https://${generateCurrentURL()}`

export const isRejectedMessage = (error: any) =>
  error?.message && error.message.includes('rejected')

export const isImTokenReject = (error: any) => {
  if (!isImToken() || !error?.message) return false
  return error.message.includes('cancel') || error.message.includes('拒绝')
}
