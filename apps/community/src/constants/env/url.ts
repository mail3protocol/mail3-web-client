import { DefaultAvatarType, envStorage } from 'shared'

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

export const PREMIUM_DOCS_URL =
  import.meta.env.NEXT_PUBLIC_PREMIUM_DOCS_URL ||
  'https://spark-rainbow-63a.notion.site/DaoDID-help-documentation-2f2def85d5ef4584b1ad40d2b4ab43b0'

export const DAODID_URL =
  import.meta.env.NEXT_PUBLIC_DAODID_URL || 'https://daodid.id'

export const CONTACT_URL =
  import.meta.env.NEXT_PUBLIC_CONTACT_URL ||
  'https://spark-rainbow-63a.notion.site/DaoDID-help-documentation-2f2def85d5ef4584b1ad40d2b4ab43b0'

export const DOT_BIT_URL =
  import.meta.env.NEXT_PUBLIC_DOT_BIT_URL || 'https://www.did.id'

export const SUPER_DID_URL =
  import.meta.env.NEXT_PUBLIC_SUPER_DID_URL || 'https://daodid.id'

export const SELL_HELP_DOCUMENT_URL =
  import.meta.env.NEXT_PUBLIC_SELL_HELP_DOCUMENT_URL ||
  'https://spark-rainbow-63a.notion.site/DaoDID-help-documentation-2f2def85d5ef4584b1ad40d2b4ab43b0'

export const APPLY_FOR_REGISTER_URL =
  import.meta.env.NEXT_PUBLIC_APPLY_FOR_REGISTER_URL ||
  'https://docs.google.com/forms/d/e/1FAIpQLSe3w4gEloIgbxR5VxVUZ121lZERg-IqvyY0SUutIlA6f7oOmA/viewform'

envStorage.setServerUrl(SERVER_URL)

export const AVATAR_TYPE =
  import.meta.env.NEXT_PUBLIC_AVATAR_TYPE || DefaultAvatarType.Normal

envStorage.setCurrentAvatar(AVATAR_TYPE as DefaultAvatarType)
