import { createContext, SetStateAction, useContext } from 'react'
import { UserInfo } from '@uauth/js'

export interface ConnectWalletApiContextValue {
  onRemember: () => Promise<void> | void
  isRemembering: boolean
  isAuth: boolean
  udClientId: string
  udRedirectUri: string
  openAuthModal: () => void
  setUnstoppableUserInfo: (update: SetStateAction<UserInfo | null>) => void
  unstoppableUserInfo: UserInfo | null
  setIsConnectingUD: (update: SetStateAction<boolean>) => void
}

export const ConnectWalletApiContext =
  createContext<ConnectWalletApiContextValue | null>(null)

export const useConnectWalletApi = () =>
  useContext(ConnectWalletApiContext) as ConnectWalletApiContextValue
