import { truncateMiddle, verifyEmail } from 'shared'
import { is0xAddress } from '../string'

export const truncateMiddle0xMail = (
  address: string,
  takeLength = 6,
  tailLength = 4
) => {
  if (!verifyEmail(address)) return address
  if (!is0xAddress(address)) return address
  const splitAddress = address.split('@')
  const realAddress = splitAddress[0]
  const suffix = splitAddress[1]
  return `${truncateMiddle(realAddress, takeLength, tailLength)}@${suffix}`
}
