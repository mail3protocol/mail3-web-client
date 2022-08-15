import { HOME_URL } from '../../constants'
import { removeMailSuffix } from './removeMailSuffix'

export function generateAvatarUrl(
  address: string,
  options?: {
    omitMailSuffix?: boolean
  }
) {
  const addressParam = options?.omitMailSuffix
    ? removeMailSuffix(address)
    : address
  return `${HOME_URL}/api/avatar/${addressParam}`
}
