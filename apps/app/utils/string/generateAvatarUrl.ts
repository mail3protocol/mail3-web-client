import { HOME_URL, APP_URL } from '../../constants/env/apps'
import { MAIL_SERVER_URL } from '../../constants/env/mailServer'
import { removeMailSuffix } from './removeMailSuffix'

export function generateAvatarUrl(
  address: string,
  options?: {
    omitMailSuffix?: boolean
  }
) {
  if (!address.endsWith(`@${MAIL_SERVER_URL}`)) {
    return `${APP_URL}/images/outside_avatar.png`
  }
  const addressParam = options?.omitMailSuffix
    ? removeMailSuffix(address)
    : address
  return `${HOME_URL}/api/avatar/${addressParam}`
}
