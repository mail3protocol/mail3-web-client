/* eslint-disable no-nested-ternary */
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
  Wrap,
  TextProps,
  Image,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import React, { useState, useRef, useMemo } from 'react'
import detectEthereumProvider from '@metamask/detect-provider'
import MetamaskPng from 'assets/wallets/metamask.png'
import WalletConnectPng from 'assets/wallets/walletconnect.png'
import PhantomPng from 'assets/wallets/phantom.png'
import BloctoPng from 'assets/wallets/blocto.png'
import SolflarePng from 'assets/wallets/solflare.png'
import TorusPng from 'assets/wallets/torus.png'
import KeplrPng from 'assets/wallets/keplr.png'
import DfinityPng from 'assets/wallets/dfinity.png'
import PolkadotPng from 'assets/wallets/polkadot.png'
import CoinbasePng from 'assets/wallets/coinbase.png'
import TronPng from 'assets/wallets/tron.png'
import AvalanchePng from 'assets/wallets/avalanche.png'

import {
  useDialog,
  // SupportedConnectors,
  metaMask,
  metaMaskStore,
  walletConnect,
  walletConnectStore,
  useSetLastConnector,
  ConnectorName,
  useLastConectorName,
  useAccount,
  useDidMount,
  useTrackClick,
  TrackEvent,
  DesiredWallet,
  TrackKey,
  useCloseOnChangePathname,
  useSetLoginInfo,
} from 'hooks'
import { Button } from 'ui/src/Button'

export interface ConnectModalProps {
  isOpen: boolean
  onClose: () => void
}

// const { useSelectedIsActivating } = SupportedConnectors

interface ConnectButtonProps extends ButtonProps {
  text: string
  icon: React.ReactNode
  isConnected?: boolean
  href?: string
  textProps?: TextProps
}

const generateIcon = (src: string, w = '24px') => (
  <Image src={src} width={w} height={w} />
)

const ConnectButton: React.FC<ConnectButtonProps> = ({
  text,
  icon,
  isLoading,
  isConnected,
  onClick,
  href,
  textProps,
  ...props
}) => {
  const flexProps: any = href ? { as: 'a', href, target: '_blank' } : {}
  return (
    <Button
      variant="outline"
      w="250px"
      px="4px"
      {...props}
      onClick={isConnected ? undefined : onClick}
    >
      <Flex w="100%" alignItems="center" {...flexProps}>
        <HStack spacing="6px" alignItems="center">
          {icon}
          <Text {...textProps}>{text}</Text>
        </HStack>
        <Spacer />
        {isLoading ? (
          <Spinner />
        ) : isConnected ? (
          <Box
            w="8px"
            h="8px"
            bg="rgb(39, 174, 96)"
            borderRadius="50%"
            mr="4px"
          />
        ) : null}
      </Flex>
    </Button>
  )
}

const PlaceholderButton: React.FC<ConnectButtonProps & { index: number }> = ({
  text,
  icon,
  onClick,
  index,
  textProps,
  ...props
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const timeoutRef = useRef<NodeJS.Timeout>()

  return (
    <WrapItem w="calc(50% - 50px)" position="relative">
      <ConnectButton
        isFullWidth
        text={text}
        icon={icon}
        size="sm"
        bg="#E7E7E7"
        border="none"
        color="6F6F6F"
        fontWeight="normal"
        fontSize="12px"
        _hover={{
          bg: '#E7E7E7',
          opacity: 0.8,
        }}
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
        textProps={textProps}
        {...props}
      />
      <SlideFade
        offsetY="20px"
        in={isOpen}
        style={
          (index + 1) % 2 !== 0
            ? { position: 'absolute', left: '-25px', top: '8px' }
            : { position: 'absolute', right: '-8px', top: '8px' }
        }
      >
        <Text position="absolute" fontStyle="italic" fontSize="12px">
          +1
        </Text>
      </SlideFade>
    </WrapItem>
  )
}

const isRejectedMessage = (error: any) => {
  if (error?.message && error.message.includes('rejected')) {
    return true
  }
  return false
}

const isImtoken = () => navigator.userAgent.toLowerCase().includes('imtoken')
const isWechat = () =>
  navigator.userAgent.toLowerCase().includes('micromessenger')

const isImotokenReject = (error: any) => {
  if (isImtoken() && error?.message && error.message.includes('拒绝')) {
    return true
  }
  if (isImtoken() && error?.message && error.message.includes('cancel')) {
    return true
  }
  return false
}

const generateDeepLink = () =>
  `https://metamask.app.link/dapp/${window.location.host}${
    window.location.pathname !== '/' ? window.location.pathname : ''
  }`

export const ConenctModal: React.FC<ConnectModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [t] = useTranslation('common')
  const [isConnectingMetamask, setIsConnectingMetamask] = useState(false)
  const dialog = useDialog()
  const setLastConnector = useSetLastConnector()
  const connectorName = useLastConectorName()
  const isConnected = !!useAccount()
  const [shouldUseDeeplink, setShouldUseDeepLink] = useState(false)
  useDidMount(() => {
    if (!isWechat()) {
      detectEthereumProvider({ timeout: 1000, silent: true }).then((res) => {
        if (res == null) {
          setShouldUseDeepLink(true)
        }
      })
    }
  })

  const trackWallet = useTrackClick(TrackEvent.ConnectWallet)

  const placeHolderBtns = useMemo(
    () => [
      {
        name: 'Phantom',
        icon: generateIcon(PhantomPng),
      },
      {
        name: 'Blocto',
        icon: generateIcon(BloctoPng),
      },
      {
        name: 'Solflare',
        icon: generateIcon(SolflarePng),
      },
      {
        name: 'Torus',
        icon: generateIcon(TorusPng),
      },
      {
        name: 'Keplr',
        icon: generateIcon(KeplrPng),
      },
      {
        name: 'Dfinity',
        icon: generateIcon(DfinityPng),
      },
      {
        name: 'Polkadot',
        icon: generateIcon(PolkadotPng),
      },
      {
        name: 'Coinbase',
        icon: generateIcon(CoinbasePng),
      },
      {
        name: 'Tron',
        icon: generateIcon(TronPng),
      },
      {
        name: 'Avalance',
        icon: generateIcon(AvalanchePng),
      },
    ],
    []
  )

  const setLoginInfo = useSetLoginInfo()
  const logout = () => setLoginInfo(null)

  useCloseOnChangePathname(onClose)

  return (
    <Modal isOpen={isOpen} onClose={onClose} autoFocus={false} isCentered>
      <ModalOverlay />
      <ModalContent maxWidth="340px">
        <ModalHeader textAlign="center" fontSize="16px">
          {t('connect.dialog-title')}
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
                (connectorName === ConnectorName.MetaMask && isConnected)
              }
              isLoading={isConnectingMetamask}
              text={t('connect.metamask')}
              icon={generateIcon(MetamaskPng)}
              href={shouldUseDeeplink ? generateDeepLink() : undefined}
              isConnected={
                connectorName === ConnectorName.MetaMask && isConnected
              }
              onClick={async () => {
                trackWallet({
                  [TrackKey.DesiredWallet]: DesiredWallet.MetaMask,
                })
                if (shouldUseDeeplink) {
                  return
                }
                if (isWechat()) {
                  dialog({
                    type: 'warning',
                    title: t('connect.notice'),
                    description: t('connect.wechat'),
                  })
                  return
                }
                setIsConnectingMetamask(true)
                try {
                  await metaMask.activate()
                  const { error } = metaMaskStore.getState()
                  if (error != null) {
                    if (!isRejectedMessage(error)) {
                      onClose()
                      dialog({
                        type: 'warning',
                        title: t('connect.notice'),
                        description: isImotokenReject(error)
                          ? t('connect.imtoken-reject')
                          : error?.message,
                      })
                    }
                  } else {
                    logout()
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
              icon={generateIcon(WalletConnectPng)}
              isDisabled={
                connectorName === ConnectorName.WalletConnect && isConnected
              }
              isConnected={
                connectorName === ConnectorName.WalletConnect && isConnected
              }
              onClick={async () => {
                trackWallet({
                  [TrackKey.DesiredWallet]: DesiredWallet.WalletConnect,
                })
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
                  logout()
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
            <Wrap spacing="10px" align="center" justify="center">
              {placeHolderBtns.map((item, index) => (
                <PlaceholderButton
                  index={index}
                  key={item.name}
                  text={item.name}
                  icon={item.icon}
                  textProps={{ color: '#6F6F6F' }}
                  onClick={() => {
                    trackWallet({
                      [TrackKey.DesiredWallet]: item.name as any,
                    })
                  }}
                />
              ))}
            </Wrap>
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
