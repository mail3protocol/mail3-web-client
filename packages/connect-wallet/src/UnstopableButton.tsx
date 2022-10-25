import {
  coinbase,
  coinbaseStore,
  ConnectorName,
  DesiredWallet,
  metaMask,
  metaMaskStore,
  TrackEvent,
  TrackKey,
  useAccount,
  useConnectedEthAccount,
  useDialog,
  useDidMount,
  useLastConectorName,
  useSetLastConnector,
  useSetLoginInfo,
  useTrackClick,
  walletConnect,
  walletConnectStore,
} from 'hooks'
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Alert,
  AlertIcon,
  AlertDescription,
  Button,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import UAuth, { UserInfo } from '@uauth/js'
import UDPng from 'assets/wallets/ud.png'
import { truncateMiddle } from 'shared'
import {
  generateMetamaskDeepLink,
  isImTokenReject,
  isRejectedMessage,
} from 'shared/src/wallet'
import { isWechat, IS_MOBILE } from 'shared/src/env'
import { ConnectButton, generateIcon } from './ConnectButton'
import { useConnectWalletApi } from './ConnectWalletApiContext'

interface UnstopableDialogProps {
  userInfo: UserInfo | null
  onClose: () => void
  isOpen: boolean
}

const UnstopableDialog: React.FC<UnstopableDialogProps> = ({
  userInfo,
  onClose,
  isOpen,
}) => {
  const [isConnecting, setIsConnecting] = useState(false)
  const { isAuth, openAuthModal } = useConnectWalletApi()
  const connectorName = useMemo(() => {
    switch (userInfo?.wallet_type_hint) {
      case 'web3':
        return ConnectorName.MetaMask
      case 'walletconnect':
        return ConnectorName.WalletConnect
      case 'coinbase-wallet':
        return ConnectorName.Coinbase
      default:
        return ConnectorName.MetaMask
    }
  }, [userInfo?.wallet_type_hint])
  const setLastConnector = useSetLastConnector()
  const account = useConnectedEthAccount(connectorName)
  const dialog = useDialog()
  const [t] = useTranslation('common')
  const connectMeamask = async () => {
    await metaMask.activate()
    const { error } = metaMaskStore.getState()
    if (error != null) {
      if (!isRejectedMessage(error)) {
        await dialog({
          type: 'warning',
          title: t('connect.notice'),
          description: isImTokenReject(error)
            ? t('connect.imtoken-reject')
            : error?.message,
        })
      }
    }
  }
  const connectWalletConnect = async () => {
    await walletConnect.activate()
    const { error } = walletConnectStore.getState()
    if (error != null) {
      if (!error.message.includes('User closed modal')) {
        dialog({
          type: 'warning',
          title: t('connect.notice'),
          description: error?.message,
        })
      }
    }
  }
  const connectCoinBase = async () => {
    await coinbase.activate()
    const { error } = coinbaseStore.getState()
    if (error != null) {
      if (!isRejectedMessage(error)) {
        await dialog({
          type: 'warning',
          title: t('connect.notice'),
          description: error?.message,
        })
      }
    }
  }
  const isWrongAddress =
    !!account &&
    account.toLowerCase() !== userInfo?.wallet_address?.toLocaleLowerCase()
  const connectWallet = async () => {
    setIsConnecting(true)
    try {
      switch (userInfo?.wallet_type_hint) {
        case 'web3':
          await connectMeamask()
          break
        case 'walletconnect':
          await connectWalletConnect()
          break
        case 'coinbase-wallet':
          await connectCoinBase()
          break
        default:
          break
      }
      setLastConnector(connectorName)
    } finally {
      setIsConnecting(false)
    }
  }
  const shortAddress = truncateMiddle(userInfo?.wallet_address ?? '', 6, 4)
  const description = useMemo(() => {
    if (isWrongAddress) {
      return (
        <>
          <Text>
            {t('ud.error-1', {
              address: truncateMiddle(account, 6, 4),
              domain: userInfo?.sub,
            })}
          </Text>
          <Text>{t('ud.error-2', { address: shortAddress })}</Text>
          <Text>{t('ud.error-3', { address: shortAddress })}</Text>
        </>
      )
    }
    return t('ud.connect-wallet-desc', { address: shortAddress })
  }, [t, shortAddress, isWrongAddress, account])
  useEffect(() => {
    if (account) {
      if (
        account.toLowerCase() === userInfo?.wallet_address?.toLowerCase() &&
        !isAuth
      ) {
        openAuthModal()
      }
    }
  }, [account, userInfo?.wallet_address, isAuth])

  return (
    <Modal
      size="xs"
      autoFocus={false}
      isOpen={isOpen}
      onClose={onClose}
      isCentered
    >
      <ModalOverlay />
      <ModalContent borderRadius="24px">
        <ModalCloseButton />
        <ModalBody mt="35px">
          <Alert
            status={isWrongAddress ? 'error' : 'info'}
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            bg="white"
          >
            <AlertIcon boxSize="20px" mr={0} mb="10px" color="black" />
            <AlertDescription
              maxWidth="sm"
              fontSize="14px"
              color="black"
              whiteSpace="pre-wrap"
            >
              {description}
            </AlertDescription>
          </Alert>
        </ModalBody>
        <ModalFooter>
          {isWrongAddress ? null : (
            <Button
              isFullWidth
              variant="primary"
              bg="brand.500"
              mb="16px"
              color="white"
              borderRadius="40px"
              _hover={{
                bg: 'brand.50',
              }}
              isLoading={isConnecting}
              onClick={connectWallet}
              fontWeight="normal"
            >
              {isWrongAddress ? t('ud.reconnect') : t('ud.connect')}
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export const UnstopableButton: React.FC<{
  onClose?: () => void
}> = ({ onClose }) => {
  const [t] = useTranslation('common')
  const [isConnecting, setIsConnecting] = useState(false)
  const dialog = useDialog()
  const connectorName = useLastConectorName()
  const setLastConector = useSetLastConnector()
  const isConnected = !!useAccount()
  const [shouldUseDeeplink] = useState(false)
  const setLoginInfo = useSetLoginInfo()
  const logout = () => setLoginInfo(null)
  const {
    udClientId,
    udRedirectUri,
    setUnstoppableUserInfo,
    unstoppableUserInfo,
    setIsConnectingUD,
  } = useConnectWalletApi()
  const uauth = useMemo(
    () =>
      new UAuth({
        clientID: udClientId,
        scope: 'openid wallet',
        redirectUri: udRedirectUri,
      }),
    [udClientId, udRedirectUri]
  )

  const trackWallet = useTrackClick(TrackEvent.ConnectWallet)
  const {
    isOpen: dialogIsOpen,
    onClose: onCloseDialog,
    onOpen: openDialog,
  } = useDisclosure()
  const isRedirectFromUD =
    location.hash.includes('code') && location.hash.includes('openid%20wallet')
  const onClick = async () => {
    trackWallet({
      [TrackKey.DesiredWallet]: DesiredWallet.UD,
    })
    if (shouldUseDeeplink) {
      return
    }
    if (isWechat()) {
      await dialog({
        type: 'warning',
        title: t('connect.notice'),
        description: t('connect.wechat'),
      })
      return
    }
    setIsConnecting(true)
    setIsConnectingUD(true)
    try {
      if (isRedirectFromUD) {
        await uauth.loginCallback()
      } else {
        if (IS_MOBILE) {
          await uauth.login()
          return
        }
        await uauth.loginWithPopup()
      }
      const userInfo = await uauth.user()
      setUnstoppableUserInfo(userInfo)
      openDialog()
    } catch (error: any) {
      //
      logout()
      onClose?.()
      setIsConnectingUD(false)
    } finally {
      setIsConnecting(false)
    }
  }
  useDidMount(() => {
    if (isRedirectFromUD) {
      onClick()
    }
  })
  return (
    <>
      <ConnectButton
        isDisabled={
          isConnecting || (connectorName === ConnectorName.UD && isConnected)
        }
        isLoading={isConnecting}
        text={t('connect.ud')}
        icon={generateIcon(UDPng)}
        href={shouldUseDeeplink ? generateMetamaskDeepLink() : undefined}
        isConnected={connectorName === ConnectorName.UD && isConnected}
        onClick={onClick}
      />
      <UnstopableDialog
        isOpen={dialogIsOpen}
        onClose={() => {
          onCloseDialog()
          setLastConector()
          setIsConnectingUD(false)
        }}
        userInfo={unstoppableUserInfo}
      />
    </>
  )
}
