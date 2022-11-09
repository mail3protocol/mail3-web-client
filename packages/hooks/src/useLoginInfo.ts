import { atomWithStorage, useAtomValue, useUpdateAtom } from 'jotai/utils'

export const COOKIE_KEY = '__MAIL3__v2'

export interface LoginInfo {
  address: string
  jwt: string
  uuid: string
  expires: string
}

const loginInfoAtom = atomWithStorage<LoginInfo | null>(COOKIE_KEY, null)

export const useLoginInfo = () => useAtomValue(loginInfoAtom)

export const useSetLoginInfo = () => useUpdateAtom(loginInfoAtom)

export const useJWT = () => {
  const loginInfo = useLoginInfo()
  return loginInfo?.jwt
}

export const useLoginAccount = () => {
  const loginInfo = useLoginInfo()
  return loginInfo?.address
}
