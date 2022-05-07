import { NextApiRequest, NextApiResponse } from 'next'
import { mockENSNames } from '../../../mocks/ens'

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    res.status(200).json(Math.random() > 0.5 ? mockENSNames : { ens_names: [] })
  } else if (req.method === 'POST') {
    res.status(200).json({ status: 'ok' })
  } else {
    res.status(404).end()
  }
}
