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
  HStack,
  Box,
  SlideFade,
  useDisclosure,
  WrapItem,
} from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import React, { useState, useRef } from 'react'
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
  useLastConectorName,
  useAccount,
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
  isConnected?: boolean
}

const ConnectButton: React.FC<ConnectButtonProps> = ({
  text,
  icon,
  isLoading,
  isConnected,
  onClick,
  ...props
}) => (
  <Button
    variant="outline"
    w="250px"
    paddingRight="6px"
    {...props}
    onClick={isConnected ? undefined : onClick}
  >
    <Flex w="100%" alignItems="center">
      <HStack spacing="6px" alignItems="center">
        {isConnected ? (
          <Box w="8px" h="8px" bg="rgb(39, 174, 96)" borderRadius="50%" />
        ) : null}
        <Text fontSize="16px" fontWeight={700}>
          {text}
        </Text>
      </HStack>
      <Spacer />
      {isLoading ? <Spinner /> : icon}
    </Flex>
  </Button>
)

const PlaceholderButton: React.FC<ConnectButtonProps> = ({
  text,
  icon,
  onClick,
  ...props
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const timeoutRef = useRef<NodeJS.Timeout>()

  return (
    <WrapItem alignItems="center" position="relative">
      <ConnectButton
        text={text}
        icon={icon}
        onClick={(e) => {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
          }
          onClose()
          onOpen()
          timeoutRef.current = setTimeout(() => {
            onClose()
          }, 1000)
          onClick?.(e)
        }}
        {...props}
      />
      <SlideFade
        offsetY="20px"
        in={isOpen}
        style={{ position: 'absolute', right: '-10px', top: '8px' }}
      >
        <Text position="absolute">+1</Text>
      </SlideFade>
    </WrapItem>
  )
}

export const ConenctModal: React.FC<ConnectModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [t] = useTranslation('common')
  const [isConnectingMetamask, setIsConnectingMetamask] = useState(false)
  const isConnectingWalletConnect = useSelectedIsActivating(walletConnect)
  const dialog = useDialog()
  const setLastConnector = useSetLastConnector()
  const connectorName = useLastConectorName()
  const isLogin = !!useAccount()

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
              isDisabled={
                isConnectingMetamask ||
                (connectorName === ConnectorName.MetaMask && isLogin)
              }
              isLoading={isConnectingMetamask}
              text={t('connect.metamask')}
              icon={<MetamaskSvg />}
              isConnected={connectorName === ConnectorName.MetaMask && isLogin}
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
              isDisabled={
                isConnectingWalletConnect ||
                (connectorName === ConnectorName.WalletConnect && isLogin)
              }
              isLoading={isConnectingWalletConnect}
              isConnected={
                connectorName === ConnectorName.WalletConnect && isLogin
              }
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
              <PlaceholderButton
                text={t('connect.phantom')}
                icon={<PhantomSvg />}
              />
              <PlaceholderButton text={t('connect.blocto')} icon={<Blocto />} />
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
