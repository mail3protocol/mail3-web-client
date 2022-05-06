import { NextApiRequest, NextApiResponse } from 'next'
import { mockSignatures } from '../../../mocks/signature'

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    res.status(200).json(mockSignatures)
  } else if (req.method === 'POST') {
    res.status(200).json({ status: 'ok' })
  } else {
    res.status(404).end()
  }
}
