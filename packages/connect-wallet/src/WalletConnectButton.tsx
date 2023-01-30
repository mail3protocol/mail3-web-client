import {
  DesiredWallet,
  TrackEvent,
  TrackKey,
  useDialog,
  useSetLoginInfo,
  useTrackClick,
} from 'hooks'
import React from 'react'
import { useTranslation } from 'react-i18next'
import WalletConnectPng from 'assets/wallets/walletconnect.png'
import {
  walletConnect,
  walletConnectStore,
  useLastConectorName,
  useSetLastConnector,
  useAccount,
  ConnectorName,
} from './connectors'
import { ConnectButton, generateIcon } from './ConnectButton'

export const WalletConnectButton: React.FC<{
  onClose?: () => void
}> = ({ onClose }) => {
  const [t] = useTranslation('common')
  const dialog = useDialog()
  const setLastConnector = useSetLastConnector()
  const connectorName = useLastConectorName()
  const isConnected = !!useAccount()
  const setLoginInfo = useSetLoginInfo()
  const logout = () => setLoginInfo(null)
  const trackWallet = useTrackClick(TrackEvent.ConnectWallet)

  return (
    <ConnectButton
      text={t('connect.wallet-connect')}
      icon={generateIcon(WalletConnectPng)}
      isDisabled={connectorName === ConnectorName.WalletConnect && isConnected}
      isConnected={connectorName === ConnectorName.WalletConnect && isConnected}
      onClick={async () => {
        trackWallet({
          [TrackKey.DesiredWallet]: DesiredWallet.WalletConnect,
        })
        await walletConnect.activate()
        const { error } = walletConnectStore.getState()
        if (error != null) {
          if (!error.message.includes('User closed modal')) {
            onClose?.()
            dialog({
              type: 'warning',
              title: t('connect.notice'),
              description: error?.message,
            })
          }
        } else {
          logout()
          setLastConnector(ConnectorName.WalletConnect)
          onClose?.()
        }
      }}
    />
  )
}
