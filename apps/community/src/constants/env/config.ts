export const IS_MOCK_API = import.meta.env.NEXT_PUBLIC_IS_MOCK_API === 'true'

export const DEFAULT_LIST_ITEM_COUNT =
  parseInt(import.meta.env.NEXT_PUBLIC_DEFAULT_LIST_ITEM_COUNT, 10) || 10

export const DEFAULT_DOWNLOAD_LIST_ITEM_COUNT =
  parseInt(import.meta.env.NEXT_PUBLIC_DEFAULT_DOWNLOAD_LIST_ITEM_COUNT, 10) ||
  1000

export const MAIL_CONTENT_IMAGE_QUOTA_KB =
  parseInt(import.meta.env.NEXT_PUBLIC_MAIL_CONTENT_IMAGE_QUOTA_KB, 10) || 5000

export const MESSAGE_SUBJUECT_LENGTH_LIMIT =
  parseInt(import.meta.env.NEXT_PUBLIC_MESSAGE_SUBJUECT_LENGTH_LIMIT, 10) || 998

export const GOOGLE_ANALYTICS_ID = import.meta.env
  .NEXT_PUBLIC_GOOGLE_ANALYTICS_ID

export const IS_DISABLED_QUEST3 =
  import.meta.env.NEXT_PUBLIC_IS_DISABLED_QUEST3 === 'true'
