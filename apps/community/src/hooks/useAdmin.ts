import { atomWithStorage, useAtomValue, useUpdateAtom } from 'jotai/utils'
import { useQuery } from 'react-query'
import { API } from '../api/api'
import { useAPI } from './useAPI'

const ADMIN_STATUS = 'mail3_admin_status'

const adminAtom = atomWithStorage<boolean>(ADMIN_STATUS, true)

export const useIsAdmin = () => useAtomValue(adminAtom)

export const useSetAdmin = () => useUpdateAtom(adminAtom)

export const getAdminStatus = async (api: API) => {
  try {
    const { data } = await api.getCollaborators()
    const address = api.getAddress()
    return data?.collaborators.some(
      (item) => item.is_administrator && item.address === address
    )
  } catch (error) {
    return false
  }
}

export const useCheckAdminStatus = () => {
  const api = useAPI()
  const setAdmin = useSetAdmin()
  return useQuery(['admin', api.getAddress()], () => getAdminStatus(api), {
    onSuccess(data) {
      setAdmin(data)
    },
    refetchOnMount: true,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })
}
