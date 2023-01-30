import React from 'react'
import { AuthModal as SharedAuthModal, useAccount } from 'connect-wallet'
import {
  useAuth,
  useAuthModalOnBack,
  useCloseAuthModal,
  useIsAuthModalOpen,
} from '../../hooks/useLogin'
import { useRemember } from '../../hooks/useRemember'

export const AuthModal: React.FC = () => {
  const account = useAccount()
  const closeAuthModal = useCloseAuthModal()
  const isAuthModalOpen = useIsAuthModalOpen()
  const onBack = useAuthModalOnBack()
  const { onRemember, isLoading } = useRemember()

  return (
    <SharedAuthModal
      account={account}
      isOpen={isAuthModalOpen}
      onClose={closeAuthModal}
      isLoading={isLoading}
      onRemember={onRemember}
      onBack={onBack}
    />
  )
}

export const Auth: React.FC = () => {
  useAuth()
  return null
}
