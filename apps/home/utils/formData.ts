import { NextApiRequest } from 'next'
import formidable from 'formidable'
import { Writable } from 'stream'

export function formidablePromise(
  req: NextApiRequest,
  opts?: Parameters<typeof formidable>[0]
): Promise<{ fields: formidable.Fields; files: formidable.Files }> {
  return new Promise((accept, reject) => {
    const form = formidable(opts)

    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }
      return accept({ fields, files })
    })
  })
}

export const fileConsumer = <T = unknown>(acc: T[]) =>
  new Writable({
    write: (chunk, _enc, next) => {
      acc.push(chunk)
      next()
    },
  })
