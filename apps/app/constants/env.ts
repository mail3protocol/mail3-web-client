export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000/api/_mocks'

export const MAIL_SERVER_URL =
  process.env.NEXT_PUBLIC_MAIL_SERVER_URL || 'mail3.me'

export const COOKIE_DOMAIN =
  process.env.NEXT_PUBLIC_COOKIE_DOMAIN || '.mail3.me'

export const DISCORD_URL =
  process.env.NEXT_PUBLIC_DISCORD_URL || 'https://discord.gg/equB6RTCHR'

export const TWITTER_URL =
  process.env.NEXT_PUBLIC_TWITTER_URL || 'https://twitter.com/mail3dao'

export const WHITE_LIST_DOC_URL =
  process.env.NEXT_PUBLIC_WHITE_LIST_DOC_URL || '#'

export const HOME_URL = process.env.NEXT_PUBLIC_HOME_URL || 'https://mail3.me'

export const GOOGLE_ANALYTICS_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID

export const MORE_DETAILS_LINK =
  process.env.NEXT_PUBLIC_MORE_DETAILS_LINK ||
  'https://feather-amaryllis-11e.notion.site/Mail3-Beta-Access-43c1bf8f21ff443ca3ca4b6f1119e0b8'

export const OFFICE_ADDRESS_LIST = [
  'mail3.eth@mail3.me',
  'mail3.eth@imibao.net',
  'mail3dao.eth@mail3.me',
  'mail3dao.eth@imibao.net',
  'no-reply-pls.eth@mail3.me',
  'no-reply-pls.eth@imibao.net',

  `no-reply-pls.eth@${MAIL_SERVER_URL}`,
  `mail3.eth@${MAIL_SERVER_URL}`,
]

export const DRIFT_BOTTLE_ADDRESS =
  process.env.NEXT_PUBLIC_DRIFT_BOTTLE_ADDRESS || `driftbottle.eth@mail3.me`

export const GOOGLE_ANALYTICS_MODE =
  process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_MODE === 'true' || false
