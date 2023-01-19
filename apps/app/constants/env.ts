// @ts-nocheck
import { DefaultAvatarType, envStorage } from 'shared'
import { MAIL_SERVER_URL } from './env/mailServer'

export * from './env/apps'
export * from './env/firebase'

export { MAIL_SERVER_URL }

export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || 'https://api.mail3.me/api/v1'

export const COOKIE_DOMAIN =
  process.env.NEXT_PUBLIC_COOKIE_DOMAIN || '.mail3.me'

export const UD_REDIRECT_URI =
  process.env.NEXT_PUBLIC_UD_REDIRECT_URI ||
  'https://mail3-app-git-feat-ud-mail3-postoffice.vercel.app'

export const UD_CLIENT_ID =
  process.env.NEXT_PUBLIC_UD_CLIENT_ID || '3d424113-5e87-4c17-a629-2632db580d64'

export const DISCORD_URL =
  process.env.NEXT_PUBLIC_DISCORD_URL || 'https://discord.gg/equB6RTCHR'

export const TWITTER_URL =
  process.env.NEXT_PUBLIC_TWITTER_URL || 'https://twitter.com/mail3dao'

export const WHITE_LIST_DOC_URL =
  process.env.NEXT_PUBLIC_WHITE_LIST_DOC_URL || '#'

export const GOOGLE_ANALYTICS_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID

export const MORE_DETAILS_LINK =
  process.env.NEXT_PUBLIC_MORE_DETAILS_LINK ||
  'https://feather-amaryllis-11e.notion.site/Mail3-Beta-Access-43c1bf8f21ff443ca3ca4b6f1119e0b8'

export const IMAGE_PROXY_URL =
  process.env.NEXT_PUBLIC_IMAGE_PROXY_URL ||
  'https://mail3.me/api/image-proxy?url='

export const OFFICE_ADDRESS_LIST = [
  'mail3.eth@mail3.me',
  'mail3.eth@imibao.net',
  'mail3dao.eth@mail3.me',
  'mail3dao.eth@imibao.net',
  'no-reply-pls.eth@mail3.me',
  'no-reply-pls.eth@imibao.net',

  'MAILER-DAEMON@mail.imibao.net',
  'MAILER-DAEMON@mail.mail3.me',

  `no-reply-pls.eth@${MAIL_SERVER_URL}`,
  `mail3.eth@${MAIL_SERVER_URL}`,
]

export const DRIFT_BOTTLE_ADDRESS =
  process.env.NEXT_PUBLIC_DRIFT_BOTTLE_ADDRESS || `driftbottle.eth@mail3.me`

export const GOOGLE_ANALYTICS_MODE =
  process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_MODE === 'true' || false

export const GITHUB_URL =
  process.env.NEXT_PUBLIC_GITHUB_URL || 'https://github.com/mail3protocol'

export const GITHUB_MAIL3_ME_BUTTON_URL =
  process.env.NEXT_PUBLIC_GITHUB_MAIL3_ME_BUTTON_URL ||
  'https://github.com/mail3protocol/mail3-me-button'

export const GITHUB_SUBSCRIBE_BUTTON_URL =
  process.env.NEXT_PUBLIC_GITHUB_SUBSCRIBE_BUTTON_URL ||
  'https://subscribe.mail3.me'

export const MIRROR_URL =
  process.env.NEXT_PUBLIC_MIRROR_URL || 'https://mirror.xyz/mail3.eth'

export const MAIL3_ME_BUTTON_MIRROR_URL =
  process.env.NEXT_PUBLIC_MAIL3_ME_BUTTON_MIRRIR_URL ||
  'https://mirror.xyz/mail3.eth/nTiZI4w3vB1BBjwc8ZLUHCJ2FPhaYJd-l7v62Tv_FY0'

export const SUBSCRIBE_BUTTON_MIRROR_URL =
  process.env.NEXT_PUBLIC_SUBSCRIBE_BUTTON_MIRRIR_URL ||
  'https://mirror.xyz/mail3.eth/WUmKSwNyE__BUb657KvLFt0CeQ1aSC5p3Tg03unfCsY'

export const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN

export const PRODUCT_RECOMMENDATIONS_ADDRESS =
  process.env.NEXT_PUBLIC_PRODUCT_RECOMMENDATIONS_ADDRESS ||
  'oxyful.eth@mail3.me'

export const PRODUCT_RECOMMENDATIONS_SUBJECT =
  process.env.NEXT_PUBLIC_PRODUCT_RECOMMENDATIONS_SUBJECT ||
  '[Product suggestion] It would be terrific if …'

export const SUBJECT_TEXT_LIMIT = (() => {
  const limit = Number(process.env.SUBJECT_TEXT_LIMIT)
  return Number.isNaN(limit) ? 998 : limit
})()

export const ENS_DOMAIN =
  process.env.NEXT_PUBLIC_ENS_DOMAIN || 'https://app.ens.domains'
export const BIT_DOMAIN =
  process.env.NEXT_PUBLIC_BIT_DOMAIN ||
  'https://www.did.id/?inviter=mail3dao.bit&channel=mail3dao.bit'
export const UD_DOMAIN =
  process.env.NEXT_PUBLIC_UD_DOMAIN || 'https://unstoppabledomains.com/'

export const AVATAR_TYPE =
  process.env.NEXT_PUBLIC_AVATAR_TYPE || DefaultAvatarType.Normal

envStorage.setCurrentAvatar(AVATAR_TYPE as DefaultAvatarType)
envStorage.setServerUrl(SERVER_URL)

export const SERVER_PV_AUTH_TOKEN =
  import.meta.env.NEXT_PUBLIC_SERVER_PV_AUTH_TOKEN ||
  'ba7ced3304d5ee3f65279e5a7a9daef5' // prod
