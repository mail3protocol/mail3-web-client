import { useCookies } from 'react-cookie'

export const COOKIE_KEY = '__MAIL3__'

export interface LoginInfo {
  address: string
  jwt: string
  uuid: string
}

export const useJWT = () => {
  const [cookie] = useCookies([COOKIE_KEY])
  return cookie?.[COOKIE_KEY]?.jwt
}

export const useLoginAccount = () => {
  const [cookie] = useCookies([COOKIE_KEY])
  return cookie?.[COOKIE_KEY]?.address
}
