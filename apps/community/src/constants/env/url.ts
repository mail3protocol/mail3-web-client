import { EnvStorage } from 'shared'

export const DISCORD_URL =
  import.meta.env.NEXT_PUBLIC_DISCORD_URL || 'https://discord.gg/equB6RTCHR'

export const TWITTER_URL =
  import.meta.env.NEXT_PUBLIC_TWITTER_URL || 'https://twitter.com/mail3dao'

export const SERVER_URL =
  import.meta.env.NEXT_PUBLIC_SERVER_URL || 'https://api.mail3.me/api/v1'

export const HOME_URL =
  import.meta.env.NEXT_PUBLIC_HOME_URL || 'https://mail3.me'

export const GALXE_URL =
  import.meta.env.NEXT_PUBLIC_GALXE_URL || 'https://galxe.com'

export const QUEST3_URL =
  import.meta.env.NEXT_PUBLIC_QUEST3_URL || 'https://quest3.xyz'

export const APP_URL =
  import.meta.env.NEXT_PUBLIC_APP_URL || 'https://app.mail3.me'

export const UD_REDIRECT_URI =
  import.meta.env.NEXT_PUBLIC_UD_REDIRECT_URI ||
  'https://mail3-app-git-feat-ud-mail3-postoffice.vercel.app'

export const UD_CLIENT_ID =
  import.meta.env.NEXT_PUBLIC_UD_CLIENT_ID ||
  '3d424113-5e87-4c17-a629-2632db580d64'

EnvStorage.setServerUrl(SERVER_URL)
