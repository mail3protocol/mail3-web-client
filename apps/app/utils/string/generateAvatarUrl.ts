import axios from 'axios'
import { isPrimitiveEthAddress, isSupportedAddress } from 'shared'
import { SERVER_URL } from '../../constants'
import { APP_URL } from '../../constants/env/apps'
import { MAIL_SERVER_URL } from '../../constants/env/mailServer'
import { removeMailSuffix } from './removeMailSuffix'

export const getMail3Avatar = (address: string) =>
  axios.get<{ avatar: string }>(`${SERVER_URL}/avatar/${address}`)

export const getPrimitiveAddress = (domain: string) =>
  axios.get<{ eth_address: string }>(`${SERVER_URL}/addresses/${domain}`)

export async function generateAvatarUrl(
  address: string,
  options?: {
    omitMailSuffix?: boolean
  }
) {
  if (
    !address.endsWith(`@${MAIL_SERVER_URL}`) &&
    !isSupportedAddress(address)
  ) {
    return `${APP_URL}/images/outside_avatar.png`
  }

  const addressParam = options?.omitMailSuffix
    ? removeMailSuffix(address)
    : address

  let url = `${APP_URL}/images/outside_avatar.png`

  try {
    if (isPrimitiveEthAddress(addressParam)) {
      const { data } = await getMail3Avatar(addressParam)
      url = data.avatar
    }

    const { data: info } = await getPrimitiveAddress(addressParam)
    const { data } = await getMail3Avatar(info.eth_address)
    url = data.avatar
  } catch (error) {
    console.log(error)
  }

  return url
}
