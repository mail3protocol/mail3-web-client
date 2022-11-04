import { atomWithStorage, useAtomValue, useUpdateAtom } from 'jotai/utils'

const USER_INFO_KEY = 'user_info'

export interface UserInfo {
  name: string
  address: string
  next_refresh_time?: string
}

const userInfoAtom = atomWithStorage<UserInfo | null>(USER_INFO_KEY, null)

export const useUserInfo = () => useAtomValue(userInfoAtom)

export const useSetUserInfo = () => useUpdateAtom(userInfoAtom)
