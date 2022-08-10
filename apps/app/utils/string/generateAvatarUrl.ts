import { HOME_URL } from '../../constants'

export function generateAvatarUrl(address: string) {
  return `${HOME_URL}/api/avatar/${address}`
}
