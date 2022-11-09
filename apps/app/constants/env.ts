// @ts-nocheck
import { EnvStorage } from 'shared'
import { MAIL_SERVER_URL } from './env/mailServer'

export * from './env/apps'
export * from './env/firebase'

export { MAIL_SERVER_URL }

export const SERVER_URL =
  import.meta.env.NEXT_PUBLIC_SERVER_URL || 'https://api.mail3.me/api/v1'

export const COOKIE_DOMAIN =
  import.meta.env.NEXT_PUBLIC_COOKIE_DOMAIN || '.mail3.me'

export const UD_REDIRECT_URI =
  import.meta.env.NEXT_PUBLIC_UD_REDIRECT_URI ||
  'https://mail3-app-git-feat-ud-mail3-postoffice.vercel.app'

export const UD_CLIENT_ID =
  import.meta.env.NEXT_PUBLIC_UD_CLIENT_ID ||
  '3d424113-5e87-4c17-a629-2632db580d64'

export const DISCORD_URL =
  import.meta.env.NEXT_PUBLIC_DISCORD_URL || 'https://discord.gg/equB6RTCHR'

export const TWITTER_URL =
  import.meta.env.NEXT_PUBLIC_TWITTER_URL || 'https://twitter.com/mail3dao'

export const WHITE_LIST_DOC_URL =
  import.meta.env.NEXT_PUBLIC_WHITE_LIST_DOC_URL || '#'

export const GOOGLE_ANALYTICS_ID = import.meta.env
  .NEXT_PUBLIC_GOOGLE_ANALYTICS_ID

export const MORE_DETAILS_LINK =
  import.meta.env.NEXT_PUBLIC_MORE_DETAILS_LINK ||
  'https://feather-amaryllis-11e.notion.site/Mail3-Beta-Access-43c1bf8f21ff443ca3ca4b6f1119e0b8'

export const IMAGE_PROXY_URL =
  import.meta.env.NEXT_PUBLIC_IMAGE_PROXY_URL ||
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
  import.meta.env.NEXT_PUBLIC_DRIFT_BOTTLE_ADDRESS || `driftbottle.eth@mail3.me`

export const GOOGLE_ANALYTICS_MODE =
  import.meta.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_MODE === 'true' || false

export const GITHUB_URL =
  import.meta.env.NEXT_PUBLIC_GITHUB_URL || 'https://github.com/mail3protocol'

export const GITHUB_MAIL3_ME_BUTTON_URL =
  import.meta.env.NEXT_PUBLIC_GITHUB_MAIL3_ME_BUTTON_URL ||
  'https://github.com/mail3protocol/mail3-me-button'

export const MIRROR_URL =
  import.meta.env.NEXT_PUBLIC_MIRROR_URL || 'https://mirror.xyz/mail3.eth'

export const MAIL3_ME_BUTTON_MIRROR_URL =
  import.meta.env.NEXT_PUBLIC_MAIL3_ME_BUTTON_MIRRIR_URL ||
  'https://mirror.xyz/mail3.eth/nTiZI4w3vB1BBjwc8ZLUHCJ2FPhaYJd-l7v62Tv_FY0'

export const IS_ANDROID = navigator.userAgent.toLowerCase().includes('android')

export const IS_CHROME =
  navigator.userAgent.toLowerCase().includes('chrome') || !!window.chrome

export const IS_FIREFOX = navigator.userAgent.toLowerCase().includes('firefox')

export const IS_EDGE = navigator.userAgent.toLowerCase().includes('edg') // edge ua is "edg"

export const IS_WIN = /windows|win32/i.test(navigator.userAgent)

export const IS_OPERA = window.opr !== undefined

export const IS_IPAD = navigator.userAgent.toLowerCase().includes('ipad')

export const IS_IPHONE =
  navigator.userAgent.toLowerCase().includes('iphone') &&
  !navigator.vendor.includes('Google')

export const IS_MOBILE = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

export const IS_IOS = IS_IPAD || IS_IPHONE

export const SENTRY_DSN = import.meta.env.NEXT_PUBLIC_SENTRY_DSN

export const PRODUCT_RECOMMENDATIONS_ADDRESS =
  import.meta.env.NEXT_PUBLIC_PRODUCT_RECOMMENDATIONS_ADDRESS ||
  'oxyful.eth@mail3.me'

export const PRODUCT_RECOMMENDATIONS_SUBJECT =
  import.meta.env.NEXT_PUBLIC_PRODUCT_RECOMMENDATIONS_SUBJECT ||
  '[Product suggestion] It would be terrific if …'

export const SUBJECT_TEXT_LIMIT = (() => {
  const limit = Number(import.meta.env.SUBJECT_TEXT_LIMIT)
  return Number.isNaN(limit) ? 998 : limit
})()

export const ENS_DOMAIN =
  import.meta.env.NEXT_PUBLIC_ENS_DOMAIN || 'https://app.ens.domains'
export const BIT_DOMAIN =
  import.meta.env.NEXT_PUBLIC_BIT_DOMAIN ||
  'https://www.did.id/?inviter=mail3dao.bit&channel=mail3dao.bit'
export const UD_DOMAIN =
  import.meta.env.NEXT_PUBLIC_UD_DOMAIN || 'https://unstoppabledomains.com/'

EnvStorage.setServerUrl(SERVER_URL)

export const DEFAULT_AVATAR_SRC =
  import.meta.env.DEFAULT_AVATAR_SRC ||
  'https://mail-public.s3.amazonaws.com/users/default_avatar.png'
