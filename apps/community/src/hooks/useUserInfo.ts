import { atom } from 'jotai'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import { useEffect } from 'react'
import { UserSettingResponse } from '../api/modals/UserInfoResponse'
import { useAPI } from './useAPI'

interface UserInfo extends UserSettingResponse {}

const userInfoAtom = atom<UserInfo | null>(null)

export const useSetUserInfo = () => useUpdateAtom(userInfoAtom)

export const useUserInfo = () => {
  const info = useAtomValue(userInfoAtom)
  const setInfo = useSetUserInfo()
  const api = useAPI()
  useEffect(() => {
    if (info) return
    api.getUserSetting().then(({ data }) => setInfo(data))
  }, [])

  return info
}
