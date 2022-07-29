// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { generateAvatarSrc, getCybertinoConnect } from 'shared'

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

  const getCybertinoConnectResponse = await getCybertinoConnect(userAddress)
    .then((r) => r.data.identity.avatar)
    .catch(() => '')
    .then((avatar) => getAvatarByUrl<string | Buffer>(avatar))
  if (handleSendFile(res, getCybertinoConnectResponse)) {
    return
  }

  const getBoringAvatarResponse = await getAvatarByUrl<string>(
    generateAvatarSrc(userAddress)
  )
  if (handleSendFile(res, getBoringAvatarResponse)) {
    return
  }

  res.status(404).send('')
}

export default address
