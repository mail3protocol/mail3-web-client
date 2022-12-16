// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'
import fs from 'fs'
import axios from 'axios'
import { isPrimitiveEthAddress } from 'shared'
import getConfig from 'next/config'
import PngAvatar from 'assets/png/default_avatar.png'
import { SERVER_URL } from '../../../constants/env'

const { serverRuntimeConfig } = getConfig()

const DEFAULT_AVATAR_SRC =
  'https://mail-public.s3.amazonaws.com/users/default_avatar.png'

// enum DefaultAvatarType {
//   Normal = 'normal',
//   Christmas = 'christmas',
// }

// const currentDefaultAvatar = DefaultAvatarType.Christmas

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

function getLocalImage(imgPath: string) {
  const filePath = path.join(__dirname, '../../../../', imgPath)
  console.log(filePath)
  const imageBuffer = fs.readFileSync(filePath)
  return {
    data: imageBuffer,
    contentType: 'image/png',
  }
}

async function address(req: NextApiRequest, res: NextApiResponse) {
  console.log('__dirname', __dirname)
  console.log('process', process.cwd())
  console.log('serverRuntimeConfig', serverRuntimeConfig.PROJECT_ROOT)
  console.log('__filename', __filename)
  console.log('PngAvatar', PngAvatar.src)
  console.log(fs.readdirSync('/'))
  console.log(fs.readdirSync(path.join(__dirname, '../../../../')))

  // const avatarPath = `/public/avatar/${currentDefaultAvatar}.png`
  const avatarPath = PngAvatar.src

  const userAddress = (req.query.address ?? '') as string
  if (isPrimitiveEthAddress(userAddress)) {
    const avatarResponse = await getMail3Avatar(userAddress)
      .then((r) => r.data.avatar)
      .catch(() => '')
      .then((avatar) => {
        if (avatar && avatar !== DEFAULT_AVATAR_SRC)
          return getAvatarByUrl<string | Buffer>(avatar)

        return getLocalImage(avatarPath)
      })

    if (handleSendFile(res, avatarResponse)) {
      return
    }
  } else {
    const ethAddressResponse = await getPrimitiveAddress(userAddress)
      .then((r) => r.data.eth_address)
      .catch(() => '')
      .then((ethAddress) => getMail3Avatar(ethAddress))
      .then((avatar) => {
        const url = avatar.data.avatar
        if (url && url !== DEFAULT_AVATAR_SRC)
          return getAvatarByUrl<string | Buffer>(url)

        return getLocalImage(avatarPath)
      })

    if (handleSendFile(res, ethAddressResponse)) {
      return
    }
  }

  res.status(404).send('')
}

export default address
