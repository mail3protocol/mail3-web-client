import { useTranslation } from 'next-i18next'
import React from 'react'
import {
  ConfirmDialog,
  useAccount,
  useAccountIsActivating,
  useConnectWalletDialog,
  useEagerConnect,
} from 'hooks'
import { ConenctModal } from './ConnectModal'
import { Button } from '../Button'

export interface ConnectWalletProps {
  renderConnected: (address: string) => React.ReactNode
}

export const ConnectWallet: React.FC<ConnectWalletProps> = ({
  renderConnected,
}) => {
  const [t] = useTranslation('connect')
  const IsActivating = useAccountIsActivating()
  const { isOpen, onOpen, onClose } = useConnectWalletDialog()
  const account = useAccount()

  useEagerConnect()

  return (
    <>
      {account ? (
        renderConnected(account)
      ) : (
        <Button
          onClick={onOpen}
          isDisabled={IsActivating}
          isLoading={IsActivating}
          loadingText={t('connecting')}
        >
          {t('connect-wallet')}
        </Button>
      )}
      <ConfirmDialog />
      <ConenctModal isOpen={isOpen} onClose={onClose} />
    </>
  )
}
