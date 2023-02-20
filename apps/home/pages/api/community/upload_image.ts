import { NextApiRequest, NextApiResponse, PageConfig } from 'next'
import S3, { ManagedUpload } from 'aws-sdk/clients/s3'
import dayjs from 'dayjs'
import axios from 'axios'
import NextCors from 'nextjs-cors'
import LRU from 'lru-cache'
import { CheckMessageQuotaResponse } from 'models'
import {
  API_ALLOW_ORIGIN,
  COMMUNITY_IMAGE_UPLOAD_LIMIT,
  SERVER_URL,
} from '../../../constants/env'
import { S3_CONFIG } from '../../../constants/env/S3'
import { fileConsumer, formidablePromise } from '../../../utils/formData'

const formidableConfig = {
  keepExtensions: true,
  maxFileSize: 5120000,
  maxFieldsSize: 10_000_000,
  maxFields: 1000,
  allowEmptyFiles: false,
  multiples: false,
  hashAlgorithm: 'sha1',
}

class FileError extends Error {}
class ParamError extends Error {}
class UploadLimitError extends Error {}

const allowMimes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp']

const allowMimeSet = new Set(allowMimes)

const uploadCountCache = new LRU({
  ttl: 86_400_000,
  ttlAutopurge: false,
  maxAge: 86_400_000,
})

enum ImageType {
  Normal = 'normal',
  Banner = 'banner',
}

async function uploadImage(req: NextApiRequest, res: NextApiResponse) {
  await NextCors(req, res, {
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: API_ALLOW_ORIGIN,
    optionsSuccessStatus: 200,
  })

  if (req.method !== 'POST') return res.status(404).end()

  try {
    const chunks: never[] = []
    const { fields, files } = await formidablePromise(req, {
      ...formidableConfig,
      fileWriteStreamHandler: () => fileConsumer(chunks),
    })
    const type = fields.type as ImageType

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
    const authorization = req.headers.authorization as string
    const messageQuote = await axios
      .get<CheckMessageQuotaResponse>(
        `${SERVER_URL}/community/check_message_quota`,
        {
          headers: {
            Authorization: authorization,
          },
        }
      )
      .then((r) => r.data.quota)
    if (messageQuote <= 0) {
      throw new ParamError(
        'Only one message can be sent within 1 day, please try again later.'
      )
    }
    const uploadCount = uploadCountCache.get<number>(authorization) || 0
    if (uploadCount >= COMMUNITY_IMAGE_UPLOAD_LIMIT) {
      throw new UploadLimitError('Uploaded quota has been used up')
    }
    uploadCountCache.set(authorization, uploadCount + 1)
    const s3 = new S3({
      accessKeyId: S3_CONFIG.AccessKeyId,
      secretAccessKey: S3_CONFIG.AccessKeySecret,
      region: S3_CONFIG.Region,
    })

    const key = (() => {
      switch (type) {
        case ImageType.Banner:
          return [
            'tmp/banners',
            fields.address,
            `${fields.address}.${files.image.originalFilename
              ?.split('.')
              .pop()}`,
          ].join('/')

        default:
          return [
            'tmp/posts',
            fields.address,
            dayjs().format('YYYYMMDD'),
            files.image.newFilename,
          ].join('/')
      }
    })()

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

    const queryParams = (() => {
      switch (type) {
        case ImageType.Banner:
          return `?h=${files.image.hash?.slice(0, 8)}`

        default:
          return ''
      }
    })()

    return res.json({
      url: `${S3_CONFIG.Host}/${key}${queryParams}`,
    })
  } catch (err: any) {
    if (
      err instanceof ParamError ||
      err instanceof FileError ||
      err instanceof UploadLimitError
    ) {
      return res.status(400).json({ message: err.message })
    }
    if (err.code === 'ERR_HTTP_INVALID_HEADER_VALUE') {
      return res.status(401).json({ message: err.message })
    }
    if (err?.response?.status === 401) {
      return res.status(401).json({ message: 'Permission error' })
    }
    if ([1009, 1010].includes(err.code)) {
      return res
        .status(400)
        .json({ message: err.message.replace('options.', '') })
    }
    console.error(err)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
}

export default uploadImage
