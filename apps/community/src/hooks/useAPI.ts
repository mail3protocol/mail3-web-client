import { useMemo } from 'react'
import { useAccount, useLoginInfo } from 'hooks'
import { API } from '../api/api'
import { activateMockApi } from '../api/api.mock'
import { IS_MOCK_API } from '../constants/env/config'

export function useAPI(options?: { isActivateMock?: boolean }) {
  const account = useAccount()
  const jwt = useLoginInfo()?.jwt
  return useMemo(() => {
    const api = new API(account, jwt)
    if (options?.isActivateMock || IS_MOCK_API) {
      activateMockApi(api)
    }
    return api
  }, [account, jwt])
}
