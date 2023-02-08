import React, { useState } from 'react'
import {
  ConnectorName,
  DesiredWallet,
  metaMask,
  metaMaskStore,
  TrackEvent,
  TrackKey,
  useAccount,
  useDialog,
  useDidMount,
  useLastConectorName,
  useSetLastConnector,
  useSetLoginInfo,
  useTrackClick,
} from 'hooks'
import MetamaskPng from 'assets/wallets/metamask.png'
import ImtokenPng from 'assets/wallets/imtoken.png'
import TrustPng from 'assets/wallets/trust.png'
import detectEthereumProvider from '@metamask/detect-provider'
import { useTranslation } from 'react-i18next'
import CoinbasePng from 'assets/wallets/coinbase.png'
import {
  isCoinbaseWallet,
  isImToken,
  isTrust,
  isWechat,
  isMobile,
} from 'shared/src/env'
import {
  generateCoinbaseWalletDeepLink,
  generateImtokenDeepLink,
  generateTrustWalletDeepLink,
  generateMetamaskDeepLink,
  isImTokenReject,
  isRejectedMessage,
} from 'shared/src/wallet'
import { WalletConnectButton } from './WalletConnectButton'
import { ConnectButton, generateIcon } from './ConnectButton'
import { CoinbaseButton } from './CoinbaseButton'
import { UnstopableButton } from './UnstopableButton'

export interface EthButtonsProps {
  onClose: () => void
}

export interface EthButtonProps {
  onClose: () => void
  isEthEnvironment: boolean
  icon: React.ReactNode
  href: string | undefined
  text: string
  desiredWallet: DesiredWallet
}

export const EthButton: React.FC<EthButtonProps> = ({
  onClose,
  isEthEnvironment,
  icon,
  href,
  text,
  desiredWallet,
}) => {
  const [t] = useTranslation('common')
  const [isConnectingMetamask, setIsConnectingMetamask] = useState(false)
  const dialog = useDialog()
  const setLastConnector = useSetLastConnector()
  const connectorName = useLastConectorName()
  const isConnected = !!useAccount()
  const setLoginInfo = useSetLoginInfo()
  const logout = () => setLoginInfo(null)

  const trackWallet = useTrackClick(TrackEvent.ConnectWallet)

  return (
    <ConnectButton
      isDisabled={
        isConnectingMetamask ||
        (connectorName === ConnectorName.MetaMask && isConnected)
      }
      isLoading={isConnectingMetamask}
      text={text}
      icon={icon}
      href={href}
      isConnected={connectorName === ConnectorName.MetaMask && isConnected}
      onClick={async () => {
        trackWallet({
          [TrackKey.DesiredWallet]: desiredWallet,
        })
        if (!isEthEnvironment) {
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
        setIsConnectingMetamask(true)
        try {
          await metaMask.activate()
          const { error } = metaMaskStore.getState()
          if (error != null) {
            if (!isRejectedMessage(error)) {
              onClose?.()
              await dialog({
                type: 'warning',
                title: t('connect.notice'),
                description: isImTokenReject(error)
                  ? t('connect.imtoken-reject')
                  : error?.message,
              })
            }
          } else {
            logout()
            setLastConnector(ConnectorName.MetaMask)
            onClose?.()
          }
        } catch (error: any) {
          //
        } finally {
          setIsConnectingMetamask(false)
        }
      }}
    />
  )
}

export function useEthButtons({ onClose }: EthButtonsProps) {
  const [isEthEnvironment, setIsEthEnvironment] = useState(false)
  const [t] = useTranslation('common')
  useDidMount(() => {
    detectEthereumProvider({ mustBeMetaMask: false }).then((res) => {
      if (res) {
        setIsEthEnvironment(true)
      }
    })
  })
  const renderMetamask = () => (
    <EthButton
      isEthEnvironment={isEthEnvironment}
      icon={generateIcon(MetamaskPng)}
      href={isEthEnvironment ? undefined : generateMetamaskDeepLink()}
      text={t('connect.metamask')}
      desiredWallet={DesiredWallet.MetaMask}
      onClose={onClose}
      key={DesiredWallet.MetaMask}
    />
  )
  const renderImtoken = () => (
    <EthButton
      isEthEnvironment={isEthEnvironment}
      icon={generateIcon(ImtokenPng)}
      href={isEthEnvironment ? undefined : generateImtokenDeepLink()}
      text="imToken"
      desiredWallet={DesiredWallet.Imtoken}
      onClose={onClose}
      key={DesiredWallet.Imtoken}
    />
  )
  const renderTrust = () => (
    <EthButton
      isEthEnvironment={isEthEnvironment}
      icon={generateIcon(TrustPng)}
      href={isEthEnvironment ? undefined : generateTrustWalletDeepLink()}
      text="Trust"
      desiredWallet={DesiredWallet.Trust}
      onClose={onClose}
      key={DesiredWallet.Trust}
    />
  )
  const renderCoinbase = () => (
    <EthButton
      isEthEnvironment={isEthEnvironment}
      icon={generateIcon(CoinbasePng)}
      href={isEthEnvironment ? undefined : generateCoinbaseWalletDeepLink()}
      text={t('connect.coinbase')}
      desiredWallet={DesiredWallet.Coinbase}
      onClose={onClose}
      key={DesiredWallet.Coinbase}
    />
  )

  if (isMobile()) {
    if (isEthEnvironment) {
      if (isImToken()) {
        return [renderImtoken()]
      }
      if (isTrust()) {
        return [renderTrust()]
      }
      if (isCoinbaseWallet()) {
        return [renderCoinbase()]
      }
      return [renderMetamask(), <UnstopableButton key={ConnectorName.UD} />]
    }
    return [
      renderMetamask(),
      <WalletConnectButton
        key={ConnectorName.WalletConnect}
        onClose={onClose}
      />,
      renderImtoken(),
      renderTrust(),
      renderCoinbase(),
      <UnstopableButton key={ConnectorName.UD} />,
    ]
  }
  return [
    renderMetamask(),
    <WalletConnectButton key={ConnectorName.WalletConnect} onClose={onClose} />,
    <CoinbaseButton key={ConnectorName.Coinbase} onClose={onClose} />,
    <UnstopableButton key={ConnectorName.UD} />,
  ]
}
