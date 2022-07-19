import { isImToken } from './env'

export const generateDeepLink = () =>
  `https://metamask.app.link/dapp/${window.location.host}${
    window.location.pathname !== '/' ? window.location.pathname : ''
  }`

export const isRejectedMessage = (error: any) =>
  error?.message && error.message.includes('rejected')

export const isImTokenReject = (error: any) => {
  if (!isImToken() || !error?.message) return false
  return error.message.includes('cancel') || error.message.includes('拒绝')
}
