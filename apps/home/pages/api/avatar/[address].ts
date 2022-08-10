// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { generateAvatarSrc, getCybertinoConnect } from 'shared'
import sharp from 'sharp'

function getAvatarByUrl<T>(url: string) {
  const catchReturn = { data: '', contentType: '' }
  if (!url) return catchReturn
  return axios
    .get<T>(url)
    .then((axiosResponse) => ({
      data: axiosResponse.data,
      contentType: axiosResponse.headers['content-type'],
    }))
    .catch(() => catchReturn)
}

async function convertSvgToPng(svg: string) {
  return sharp(Buffer.from(svg), { density: 300 }).png().toBuffer()
}

async function handleSendFileWithConvertSvgToPng(
  res: NextApiResponse,
  {
    data,
    contentType,
  }: {
    data: string | Buffer
    contentType: string
  }
) {
  if (contentType === 'image/svg+xml' && typeof data === 'string') {
    const pngBuffer = await convertSvgToPng(data)
    res.status(200).setHeader('Content-Type', 'image/png').send(pngBuffer)
    return true
  }
  return false
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

  const cybertinoConnectResponse = await getCybertinoConnect(userAddress)
    .then((r) => r.data.identity.avatar)
    .catch(() => '')
    .then((avatar) => getAvatarByUrl<string | Buffer>(avatar))

  if (await handleSendFileWithConvertSvgToPng(res, cybertinoConnectResponse)) {
    return
  }
  if (handleSendFile(res, cybertinoConnectResponse)) {
    return
  }

  const boringAvatarResponse = await getAvatarByUrl<string>(
    generateAvatarSrc(userAddress)
  )
  if (await handleSendFileWithConvertSvgToPng(res, boringAvatarResponse)) {
    return
  }
  if (handleSendFile(res, boringAvatarResponse)) {
    return
  }

  res.status(404).send('')
}

export default address
