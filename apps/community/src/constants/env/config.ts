export const IS_MOCK_API = import.meta.env.NEXT_PUBLIC_IS_MOCK_API === 'true'

export const DEFAULT_LIST_ITEM_COUNT =
  parseInt(import.meta.env.NEXT_PUBLIC_DEFAULT_LIST_ITEM_COUNT, 10) || 10
