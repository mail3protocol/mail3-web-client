import { atom } from 'jotai'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import { UserSettingResponse } from '../api/modals/UserInfoResponse'

interface UserInfo extends UserSettingResponse {}

const userInfoAtom = atom<UserInfo | null>(null)

export const useUserInfo = () => useAtomValue(userInfoAtom)

export const useSetUserInfo = () => useUpdateAtom(userInfoAtom)
