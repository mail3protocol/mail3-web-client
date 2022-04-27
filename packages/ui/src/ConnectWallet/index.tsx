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
  const [t] = useTranslation('common')
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
          w="200px"
          loadingText={t('connect.connecting')}
        >
          {t('connect.connect-wallet')}
        </Button>
      )}
      <ConfirmDialog />
      <ConenctModal isOpen={isOpen} onClose={onClose} />
    </>
  )
}
