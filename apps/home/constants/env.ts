import { DefaultAvatarType, envStorage } from 'shared'

export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://app.mail3.me'
export const TWITTER_URL =
  process.env.NEXT_PUBLIC_TWITTER_URL || 'https://twitter.com/mail3dao'
export const DISCORD_URL =
  process.env.NEXT_PUBLIC_DISCORD_URL || 'https://discord.gg/equB6RTCHR'
export const LIGHT_PAPER_URL =
  process.env.NEXT_PUBLIC_LIGHT_PAPER_URL || '/mail3-litepaper.pdf'
export const LIGHT_PAPER_JP_URL =
  process.env.NEXT_PUBLIC_LIGHT_PAPER_URL || '/mail3-litepaper-jp.pdf'
export const LIGHT_PAPER_CH_URL =
  process.env.NEXT_PUBLIC_LIGHT_PAPER_URL || '/mail3-litepaper-ch.pdf'
export const WHITE_LIST_URL =
  process.env.NEXT_PUBLIC_WHITE_LIST_URL || `${APP_URL}/whitelist`

export const TESTING_URL =
  process.env.NEXT_PUBLIC_TESTING_URL || `${APP_URL}/testing`
export const LAUNCH_URL = process.env.NEXT_PUBLIC_LANCH_URL || APP_URL
export const MIRROR_URL =
  process.env.NEXT_PUBLIC_MIRROR_URL || 'https://mirror.xyz/mail3.eth'
export const MEDIUM_URL =
  process.env.NEXT_PUBLIC_MEDIUM_URL || 'https://medium.com/@mail3'
export const CONTACT_US_URL =
  process.env.NEXT_PUBLIC_CONTACT_US_URL || 'mailto:mail3.eth@mail3.me'
export const GITHUB_URL =
  process.env.NEXT_PUBLIC_GITHUB_URL || 'https://github.com/mail3protocol'

export const MAIL3_ME_BUTTON_GITHUB_URL =
  process.env.NEXT_PUBLIC_GITHUB_MAIL3_ME_BUTTON_URL ||
  'https://github.com/mail3protocol/mail3-me-button'
export const MAIL3_ME_BUTTON_MIRROR_URL =
  process.env.NEXT_PUBLIC_MIRRIR_MAIL3_ME_BUTTON_URL ||
  'https://mirror.xyz/mail3.eth/nTiZI4w3vB1BBjwc8ZLUHCJ2FPhaYJd-l7v62Tv_FY0'

export const GOOGLE_ANALYTICS_ID =
  process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID ?? 'G-1PW4LM5ETS'

export const MAIL_SERVER_URL =
  process.env.NEXT_PUBLIC_MAIL_SERVER_URL || 'mail3.me'

export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || 'https://api.mail3.me/api/v1'

export const COMMUNITY_URL =
  process.env.NEXT_PUBLIC_COMMUNITY_URL || 'https://subscribe.mail3.me'

export const COMMUNITY_IMAGE_UPLOAD_LIMIT =
  parseInt(process.env.NEXT_PUBLIC_IMAGE_UPLOAD_LIMIT || `50`, 10) || 50

export const AVATAR_IMAGE_UPLOAD_LIMIT =
  parseInt(process.env.NEXT_PUBLIC_AVATAR_IMAGE_UPLOAD_LIMIT || `50`, 10) || 50

export const API_ALLOW_ORIGIN = process.env.API_ALLOW_ORIGIN?.split(',').map(
  (o) => o.trim()
) || [COMMUNITY_URL, APP_URL]

export const SUBSCRIBE_MAIL3_UUID =
  process.env.SUBSCRIBE_MAIL3_UUID || '63398e16-6541-45a6-a497-d17775d5bfd6'

export const SUBSCRIBE_BUTTON_MIRROR_URL =
  process.env.NEXT_PUBLIC_SUBSCRIBE_BUTTON_MIRRIR_URL ||
  'https://mirror.xyz/mail3.eth/WUmKSwNyE__BUb657KvLFt0CeQ1aSC5p3Tg03unfCsY'

export const SUBSCRIBE_BUTTON_BACKEND_URL =
  process.env.NEXT_PUBLIC_SUBSCRIBE_BACKEND_BUTTON_URL ||
  'https://subscribe.mail3.me'

export const HOME_URL = process.env.NEXT_PUBLIC_HOME_URL || 'https://mail3.me'

export const AVATAR_TYPE =
  process.env.NEXT_PUBLIC_AVATAR_TYPE || DefaultAvatarType.Normal

envStorage.setCurrentAvatar(AVATAR_TYPE as DefaultAvatarType)
envStorage.setServerUrl(SERVER_URL)
