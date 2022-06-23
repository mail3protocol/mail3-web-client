import { atomWithStorage, useAtomValue, useUpdateAtom } from 'jotai/utils'
import { LoginInfo } from 'hooks'

const loginInfoAtom = atomWithStorage<LoginInfo | null>(
  'mail3_login_info',
  null
)

export const useLoginInfo = () => useAtomValue(loginInfoAtom)

export const useSetLoginInfo = () => useUpdateAtom(loginInfoAtom)
