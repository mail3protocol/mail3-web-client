export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://mail3.app'
export const TWITTER_URL =
  process.env.NEXT_PUBLIC_TWITTER_URL || 'https://twitter.com/mail3dao'
export const DISCORD_URL =
  process.env.NEXT_PUBLIC_DISCORD_URL || 'https://discord.gg/J3ac6YcXUU'
export const LIGHT_PAPER_URL =
  process.env.NEXT_PUBLIC_LIGHT_PAPER_URL || '/litepaper.pdf'
export const WHITE_LIST_URL =
  process.env.NEXT_PUBLIC_WHITE_LIST_URL || `${APP_URL}/whitelist`
export const MIRROR_URL =
  process.env.NEXT_PUBLIC_MIRROR_URL || 'https://mirror.xyz/mail3dao.eth'
export const MEDIUM_URL =
  process.env.NEXT_PUBLIC_MEDIUM_URL || 'https://medium.com/@mail3'
export const CONTACT_US_URL =
  process.env.NEXT_PUBLIC_CONTACT_US_URL || 'mailto:mail3dao.eth@mail3.me'
export const IS_FORCE_WHITELIST = true
export const WHITE_LIST_APPLY_DATE_RANGE: [Date, Date] = [
  new Date('2022-6-7'),
  new Date('2022-6-14'),
]
export const BETA_TESTING_DATE_RANGE: [Date, Date] = [
  new Date('2022-6-7'),
  new Date('2022-6-30'),
]
export const APPLICATION_PERIOD_DATE_RANGE: [Date, Date] = [
  new Date('2022-6-7'),
  new Date('2022-6-30'),
]
