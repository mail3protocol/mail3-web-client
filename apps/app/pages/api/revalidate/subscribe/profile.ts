import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).send('')
  }
  const { token, name } = req.body

  if (token !== process.env.REVALIDATE_TOKEN) {
    return res.status(401).send('')
  }

  try {
    await res.revalidate(`/${name}`)
    return res.json({ revalidated: true })
  } catch (error) {
    return res.status(500).send('Error revalidating')
  }
}
