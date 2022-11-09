import { isPrimitiveEthAddress, isZilpayAddress, truncateMiddle } from 'shared'

export function formatUserName(username?: string) {
  if (!username) return username
  if (isPrimitiveEthAddress(username) || isZilpayAddress(username)) {
    return truncateMiddle(username, 6, 4, '_')
  }
  return username
}
