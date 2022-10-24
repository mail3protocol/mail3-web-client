import { createContext, SetStateAction, useContext } from 'react'
import { UserInfo } from '@uauth/js'

export interface ConnectWalletApiContextValue {
  onRemember: () => Promise<void> | void
  isRemembering: boolean
  isAuth: boolean
  udClientId: string
  udRedirectUri: string
  openAuthModal: () => void
  setUnstopableUserInfo: (update: SetStateAction<UserInfo | null>) => void
  unstaopableUserInfo: UserInfo | null
  setIsConnectingUD: (update: SetStateAction<boolean>) => void
}

export const ConnectWalletApiContext =
  createContext<ConnectWalletApiContextValue | null>(null)

export const useConnectWalletApi = () =>
  useContext(ConnectWalletApiContext) as ConnectWalletApiContextValue
