import { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'
import fs from 'fs'

const blackIcon = fs.readFileSync(
  path.resolve('.', 'pages/api/logo', 'icons', 'black.png')
)
const whiteIcon = fs.readFileSync(
  path.resolve('.', 'pages/api/logo', 'icons', 'white.png')
)
const lightIcon = fs.readFileSync(
  path.resolve('.', 'pages/api/logo', 'icons', 'light.png')
)
const solidIcon = fs.readFileSync(
  path.resolve('.', 'pages/api/logo', 'icons', 'solid.png')
)

const logo = (req: NextApiRequest, res: NextApiResponse) => {
  const iconStyle = (req.query.style as string) || 'solid'
  let icon = solidIcon
  switch (iconStyle) {
    case 'solid':
      icon = solidIcon
      break
    case 'light':
      icon = lightIcon
      break
    case 'white':
      icon = whiteIcon
      break
    case 'black':
      icon = blackIcon
      break
    default:
      icon = solidIcon
      break
  }
  res.setHeader('Content-Type', 'image/png')
  res.send(icon)
}

export default logo
