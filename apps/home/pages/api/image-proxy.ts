import { NextApiRequest, NextApiResponse } from 'next'
import http from 'http'
import https from 'https'
import url from 'url'

const imageProxy = (req: NextApiRequest, res: NextApiResponse) => {
  const part = url.parse(req.url!, true)
  const imageUrl = part.query.url as string

  const parts = url.parse(imageUrl)

  const filename = parts.pathname?.split('/').pop() ?? 'image.png'

  const options = {
    port: parts.protocol === 'https:' ? 443 : 80,
    host: parts.hostname,
    method: 'GET',
    path: parts.path,
    accept: '*/*',
  }

  const request =
    options.port === 443 ? https.request(options) : http.request(options)

  request.addListener('response', (proxyRes) => {
    let offset = 0
    const contentLength = parseInt(proxyRes.headers['content-length']!, 10)
    const body = Buffer.alloc(contentLength)

    proxyRes.setEncoding('binary')
    proxyRes.addListener('data', (chunk) => {
      body.write(chunk, offset, 'binary')
      offset += chunk.length
    })

    proxyRes.addListener('end', () => {
      res.setHeader('Content-Type', filename)
      res.write(body)
      res.end()
    })
  })

  request.end()
}

export default imageProxy
