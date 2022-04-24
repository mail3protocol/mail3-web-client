import {
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalContent,
  VStack,
} from '@chakra-ui/react'
import { Button } from 'ui'
import { useTranslation } from 'next-i18next'
import React from 'react'
import { SupportedConnectors } from '../../connectors'
import { metaMask } from '../../connectors/MetaMask'
import { walletConnect } from '../../connectors/WalletConnect'

export interface ConnectModalProps {
  isOpen: boolean
  onClose: () => void
}

const { useSelectedIsActivating } = SupportedConnectors

export const ConenctModal: React.FC<ConnectModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [t] = useTranslation('connect')
  const isConnectingMetamask = useSelectedIsActivating(metaMask)
  const isConnectingWalletConnect = useSelectedIsActivating(walletConnect)
  return (
    <Modal isOpen={isOpen} onClose={onClose} autoFocus={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t('connect-wallet')}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing="10px">
            <Button
              isDisabled={isConnectingMetamask}
              isLoading={isConnectingMetamask}
              onClick={() => {
                gtag('event', 'desired_wallet', {
                  wallet_name: 'Phantom',
                })
                metaMask.activate().then(() => onClose())
              }}
            >
              {t('metamask')}
            </Button>
            <Button
              isDisabled={isConnectingWalletConnect}
              isLoading={isConnectingWalletConnect}
              onClick={() => walletConnect.activate().then(() => onClose())}
            >
              {t('wallet-connect')}
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
