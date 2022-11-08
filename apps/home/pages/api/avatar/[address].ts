// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { isPrimitiveEthAddress } from 'shared'
import { SERVER_URL } from '../../../constants/env'

const getMail3Avatar = (ethAddress: string) =>
  axios.get<{ avatar: string }>(`${SERVER_URL}/avatar/${ethAddress}`)

const getPrimitiveAddress = (domain: string) =>
  axios.get<{ eth_address: string }>(`${SERVER_URL}/addresses/${domain}`)

function getAvatarByUrl<T>(url: string) {
  const catchReturn = { data: '', contentType: '' }
  if (!url) return catchReturn
  return axios
    .get<T>(url, {
      responseType: 'stream',
    })
    .then((axiosResponse) => ({
      data: axiosResponse.data,
      contentType: axiosResponse.headers['content-type'],
    }))
    .catch(() => catchReturn)
}

function handleSendFile(
  res: NextApiResponse,
  {
    data,
    contentType,
  }: {
    data: string | Buffer
    contentType: string
  }
) {
  if (data && contentType) {
    res.status(200).setHeader('Content-Type', contentType).send(data)
    return true
  }
  return false
}

async function address(req: NextApiRequest, res: NextApiResponse) {
  const userAddress = (req.query.address ?? '') as string
  if (isPrimitiveEthAddress(userAddress)) {
    const avatarResponse = await getMail3Avatar(userAddress)
      .then((r) => r.data.avatar)
      .catch(() => '')
      .then((avatar) => getAvatarByUrl<string | Buffer>(avatar))

    if (handleSendFile(res, avatarResponse)) {
      return
    }
  } else {
    const ethAddressResponse = await getPrimitiveAddress(userAddress)
      .then((r) => r.data.eth_address)
      .catch(() => '')
      .then((ethAddress) => getMail3Avatar(ethAddress))
      .then((avatar) => getAvatarByUrl<string | Buffer>(avatar.data.avatar))

    if (handleSendFile(res, ethAddressResponse)) {
      return
    }
  }

  res.status(404).send('')
}

export default address
