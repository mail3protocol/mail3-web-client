import { useAccount } from 'hooks'
import { atom, useAtom } from 'jotai'
import { useUpdateAtom } from 'jotai/utils'
import { useQuery } from 'react-query'
import { UserSettingResponse } from '../api/modals/UserInfoResponse'
import { QueryKey } from '../api/QueryKey'
import { useAPI } from './useAPI'

interface UserInfo extends UserSettingResponse {}

const userInfoAtom = atom<UserInfo | null>(null)

export const useSetUserInfo = () => useUpdateAtom(userInfoAtom)

export const useUserInfo = () => {
  const [info, setInfo] = useAtom(userInfoAtom)
  const account = useAccount()
  const api = useAPI()

  useQuery(
    [QueryKey.GetUserSetting, account],
    async () => {
      const res = await api.getUserSetting()
      return res.data
    },
    {
      enabled: !info,
      refetchIntervalInBackground: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      onSuccess(d) {
        setInfo(d)
      },
    }
  )

  return info
}
