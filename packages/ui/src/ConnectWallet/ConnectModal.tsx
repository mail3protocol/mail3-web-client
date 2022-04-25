import {
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalContent,
  VStack,
  Center,
  Heading,
  Text,
  ModalFooter,
  ButtonProps,
  Spacer,
  Spinner,
  Flex,
} from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import React, { useState } from 'react'
import MetamaskSvg from 'assets/svg/metamask.svg'
import WalletConnectSvg from 'assets/svg/wallet-connect.svg'
import PhantomSvg from 'assets/svg/phantom.svg'
import Blocto from 'assets/svg/blocto.svg'
import {
  useDialog,
  SupportedConnectors,
  metaMask,
  metaMaskStore,
  walletConnect,
  walletConnectStore,
  useSetLastConnector,
  ConnectorName,
} from 'hooks'
import { Button } from '../Button'

export interface ConnectModalProps {
  isOpen: boolean
  onClose: () => void
}

const { useSelectedIsActivating } = SupportedConnectors

interface ConnectButtonProps extends ButtonProps {
  text: string
  icon: React.ReactNode
}

const ConnectButton: React.FC<ConnectButtonProps> = ({
  text,
  icon,
  isLoading,
  ...props
}) => (
  <Button variant="outline" w="250px" paddingRight="6px" {...props}>
    <Flex w="100%" alignItems="center">
      <Text fontSize="16px" fontWeight={700}>
        {text}
      </Text>
      <Spacer />
      {isLoading ? <Spinner /> : icon}
    </Flex>
  </Button>
)

export const ConenctModal: React.FC<ConnectModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [t] = useTranslation('common')
  const [isConnectingMetamask, setIsConnectingMetamask] = useState(false)
  const isConnectingWalletConnect = useSelectedIsActivating(walletConnect)
  const dialog = useDialog()
  const setLastConnector = useSetLastConnector()

  return (
    <Modal isOpen={isOpen} onClose={onClose} autoFocus={false} isCentered>
      <ModalOverlay />
      <ModalContent maxWidth="340px">
        <ModalHeader textAlign="center" fontSize="16px">
          {t('connect.connect-wallet')}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody
          padding="24px 0 0 0"
          borderTop="1px solid #E0E0E0"
          textAlign="center"
        >
          <VStack spacing="10px">
            <ConnectButton
              isDisabled={isConnectingMetamask}
              isLoading={isConnectingMetamask}
              text={t('connect.metamask')}
              icon={<MetamaskSvg />}
              onClick={async () => {
                setIsConnectingMetamask(true)
                try {
                  await metaMask.activate()
                  const { error } = metaMaskStore.getState()
                  if (error != null) {
                    if (!error?.message.includes('User rejected')) {
                      onClose()
                      dialog({
                        type: 'warning',
                        title: t('connect.notice'),
                        description: error?.message,
                      })
                    }
                  } else {
                    setLastConnector(ConnectorName.MetaMask)
                    onClose()
                  }
                } catch (error: any) {
                  //
                } finally {
                  setIsConnectingMetamask(false)
                }
              }}
            />
            <ConnectButton
              text={t('connect.wallet-connect')}
              icon={<WalletConnectSvg />}
              isDisabled={isConnectingWalletConnect}
              isLoading={isConnectingWalletConnect}
              onClick={async () => {
                await walletConnect.activate()
                const { error } = walletConnectStore.getState()
                if (error != null) {
                  if (!error.message.includes('User closed modal')) {
                    onClose()
                    dialog({
                      type: 'warning',
                      title: t('connect.notice'),
                      description: error?.message,
                    })
                  }
                } else {
                  setLastConnector(ConnectorName.WalletConnect)
                  onClose()
                }
              }}
            />
          </VStack>
          <Center
            bg="#F7F7F7"
            padding="16px 0 24px 0"
            flexDirection="column"
            mt="24px"
          >
            <Heading fontSize="14px" mb="8px">
              {t('connect.coming-soon')}
            </Heading>
            <Text fontSize="12px" color="#6f6f6f" mb="16px" maxWidth="250px">
              {t('connect.desired-wallet')}
            </Text>
            <VStack spacing="10px">
              <ConnectButton
                text={t('connect.phantom')}
                icon={<PhantomSvg />}
              />
              <ConnectButton text={t('connect.blocto')} icon={<Blocto />} />
            </VStack>
          </Center>
          <ModalFooter fontSize="12px" pb="24px" pt="16px">
            <Center maxWidth="280px" textAlign="center">
              {t('connect.footer')}
            </Center>
          </ModalFooter>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
