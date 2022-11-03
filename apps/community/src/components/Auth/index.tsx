import React from 'react'
import { useAccount } from 'hooks'
import { useAtomValue } from 'jotai/utils'
import { AuthModal } from 'connect-wallet'
import { useRemember } from '../../hooks/useRemember'
import {
  isAuthModalOpenAtom,
  useCloseAuthModal,
} from '../../hooks/useAuthDialog'
import { useAuthModalOnBack } from '../../hooks/useLogin'

export const AuthDialog: React.FC = () => {
  const account = useAccount()
  const isAuthModalOpen = useAtomValue(isAuthModalOpenAtom)
  const onCloseAuthDialog = useCloseAuthModal()
  const { onRemember, isLoading } = useRemember()
  const onBack = useAuthModalOnBack()

  return (
    <AuthModal
      account={account}
      isOpen={isAuthModalOpen}
      onClose={onCloseAuthDialog}
      onRemember={async () => {
        await onRemember()
        onCloseAuthDialog()
      }}
      isLoading={isLoading}
      onBack={onBack}
    />
  )
}
