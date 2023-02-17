import { useMemo } from 'react'
import { useAccount, useLoginInfo } from 'hooks'
import { API } from '../api/api'
import { IS_MOCK_API } from '../constants/env/config'
import { useLogout } from './useLogin'

export function useAPI(options?: { isActivateMock?: boolean }) {
  const account = useAccount()
  const logout = useLogout()
  const jwt = useLoginInfo()?.jwt
  return useMemo(() => {
    const api = new API(account, jwt)
    api.axiosInstance.interceptors.response.use(
      (r) => r,
      async (err) => {
        if (err?.response?.status === 401) {
          await logout()
        }
        throw err
      }
    )
    if (options?.isActivateMock || IS_MOCK_API) {
      import('../api/api.mock').then(({ activateMockApi }) => {
        activateMockApi(api)
      })
    }
    return api
  }, [account, jwt, logout])
}
