export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://mail3.app'
export const TWITTER_URL = process.env.NEXT_PUBLIC_TWITTER_URL || '#'
export const DISCORD_URL = process.env.NEXT_PUBLIC_DISCORD_URL || '#'
export const LIGHT_PAPER_URL = process.env.NEXT_PUBLIC_LIGHT_PAPER_URL || '#'
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

export const GOOGLE_ANALYTICS_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID
