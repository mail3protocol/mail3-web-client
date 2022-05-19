import { useTranslation } from 'next-i18next'
import React from 'react'
import {
  ConfirmDialog,
  useAccount,
  useConnectWalletDialog,
  useEagerConnect,
} from 'hooks'
import { ButtonProps } from '@chakra-ui/react'
import { ConenctModal } from './ConnectModal'
import { Button } from '../Button'

export interface ConnectWalletProps extends ButtonProps {
  renderConnected: (address: string) => React.ReactNode
}

export const ConnectWallet: React.FC<ConnectWalletProps> = ({
  renderConnected,
  ...props
}) => {
  const [t] = useTranslation('common')
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
          w="200px"
          loadingText={t('connect.connecting')}
          {...props}
        >
          {t('connect.connect-wallet')}
        </Button>
      )}
      <ConfirmDialog />
      <ConenctModal isOpen={isOpen} onClose={onClose} />
    </>
  )
}
