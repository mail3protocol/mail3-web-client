import { NextApiRequest, NextApiResponse, PageConfig } from 'next'
import S3, { ManagedUpload } from 'aws-sdk/clients/s3'
import dayjs from 'dayjs'
import axios from 'axios'
import { S3_CONFIG, SERVER_URL } from '../../../constants/env'
import { fileConsumer, formidablePromise } from '../../../utils/formData'

const formidableConfig = {
  keepExtensions: true,
  maxFileSize: 5120000,
  maxFieldsSize: 10_000_000,
  maxFields: 1,
  allowEmptyFiles: false,
  multiples: false,
}

class FileError extends Error {}
class ParamError extends Error {}

const allowMimes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp']

const allowMimeSet = new Set(allowMimes)

async function uploadImage(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(404).end()

  try {
    const chunks: never[] = []
    const { fields, files } = await formidablePromise(req, {
      ...formidableConfig,
      fileWriteStreamHandler: () => fileConsumer(chunks),
    })
    const fileData = Buffer.concat(chunks)
    if (!fields.address) {
      throw new ParamError('`address` required')
    }
    if (!files.image) {
      throw new ParamError('`image` required')
    }
    if (
      !('newFilename' in files.image) ||
      !('mimetype' in files.image) ||
      !allowMimeSet.has(files.image.mimetype!)
    ) {
      throw new FileError('The file is not supported')
    }
    const lastMessage = await axios
      .get(`${SERVER_URL}/community/messages`, {
        params: { count: 1 },
        headers: {
          Authorization: req.headers.authorization as string,
        },
      })
      .then((r) => r.data.messages[0])
    if (
      lastMessage &&
      dayjs.unix(lastMessage.created_at).add(1, 'day').isAfter(dayjs())
    ) {
      throw new ParamError(
        'Only one message can be sent within 24 hours, please try again later.'
      )
    }

    const s3 = new S3({
      accessKeyId: S3_CONFIG.AccessKeyId,
      secretAccessKey: S3_CONFIG.AccessKeySecret,
      region: S3_CONFIG.Region,
    })
    const key = [
      'tmp/posts',
      fields.address,
      dayjs().format('YYYYMMDD'),
      files.image.newFilename,
    ].join('/')

    const s3UploadParams = {
      Bucket: S3_CONFIG.Bucket,
      Key: key,
      Body: fileData,
      ContentType: files.image.mimetype!,
      ACL: 'public-read',
    }
    await new Promise((resolve, reject) => {
      s3.upload(
        s3UploadParams,
        (err: any, sendData: ManagedUpload.SendData) => {
          if (err) {
            reject(err)
          }
          resolve(sendData)
        }
      )
    })
    return res.status(200).json({
      url: `${S3_CONFIG.Host}/${key}`,
    })
  } catch (err: any) {
    if (err instanceof ParamError || err instanceof FileError) {
      return res.status(400).json({ error: err.message })
    }
    if (err.code === 'ERR_HTTP_INVALID_HEADER_VALUE') {
      return res.status(401).json({ error: err.message })
    }
    if (err.response.status === 401) {
      return res.status(401).json({ error: 'Permission error' })
    }
    if (err.code === 1009) {
      return res
        .status(400)
        .json({ error: err.message.replace('options.', '') })
    }
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
}

export default uploadImage
