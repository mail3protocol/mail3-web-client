import React, { useMemo } from 'react'
import { useAtomValue } from 'jotai/utils'
import {
  ConnectModalWithMultichain,
  ConnectWalletApiContext,
} from 'connect-wallet-ui'
import {
  isOpenConnectWalletDialogAtom,
  useCloseConnectWalletDialog,
} from '../../hooks/useConnectWalletDialog'
import { useIsAuthenticated, useUnstoppable } from '../../hooks/useLogin'
import { useRemember } from '../../hooks/useRemember'
import { useOpenAuthModal } from '../../hooks/useAuthDialog'
import { UD_CLIENT_ID, UD_REDIRECT_URI } from '../../constants/env/url'

export const ConnectWalletDialog: React.FC = () => {
  const isAuthModalOpen = useAtomValue(isOpenConnectWalletDialogAtom)
  const onCloseAuthDialog = useCloseConnectWalletDialog()

  const isAuth = useIsAuthenticated()
  const { onRemember, isLoading: isRemembering } = useRemember()
  const openAuthModal = useOpenAuthModal()
  const { setUnstoppableUserInfo, unstoppableUserInfo, setIsConnectingUD } =
    useUnstoppable()

  return (
    <ConnectWalletApiContext.Provider
      value={useMemo(
        () => ({
          isAuth,
          onRemember,
          isRemembering,
          openAuthModal,
          udClientId: UD_CLIENT_ID,
          udRedirectUri: UD_REDIRECT_URI,
          setUnstoppableUserInfo,
          unstoppableUserInfo,
          setIsConnectingUD,
        }),
        [
          isAuth,
          onRemember,
          isRemembering,
          openAuthModal,
          setUnstoppableUserInfo,
          unstoppableUserInfo,
          setIsConnectingUD,
          UD_CLIENT_ID,
          UD_REDIRECT_URI,
        ]
      )}
    >
      <ConnectModalWithMultichain
        isOpen={isAuthModalOpen}
        onClose={onCloseAuthDialog}
      />
    </ConnectWalletApiContext.Provider>
  )
}
