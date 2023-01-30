import {
  DesiredWallet,
  TrackEvent,
  TrackKey,
  useDialog,
  useTrackClick,
} from 'hooks'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ZilpayPng from 'assets/wallets/zilpay.png'
import {
  zilpay,
  useLastConectorName,
  useSetLastConnector,
  ConnectorName,
} from './connectors'

import { ConnectButton, generateIcon } from './ConnectButton'
import { useConnectWalletApi } from './ConnectWalletApiContext'

export const ZilPayButton: React.FC<{
  onClose?: () => void
}> = ({ onClose }) => {
  const [t] = useTranslation('common')
  const dialog = useDialog()
  const [isConnecting, setIsConnecting] = useState(false)
  const setLastConnector = useSetLastConnector()
  const connectorName = useLastConectorName()
  const { isAuth: isConnected } = useConnectWalletApi()

  const trackWallet = useTrackClick(TrackEvent.ConnectWallet)

  return (
    <ConnectButton
      text={t('connect.zilpay')}
      icon={generateIcon(ZilpayPng)}
      isLoading={isConnecting}
      isDisabled={
        isConnecting || (connectorName === ConnectorName.Zilpay && isConnected)
      }
      isConnected={connectorName === ConnectorName.Zilpay && isConnected}
      onClick={async () => {
        trackWallet({
          [TrackKey.DesiredWallet]: DesiredWallet.ZilPay,
        })
        setIsConnecting(true)
        try {
          await zilpay.connect()
          setLastConnector(ConnectorName.Zilpay)
          onClose?.()
        } catch (error: any) {
          onClose?.()
          dialog({
            type: 'warning',
            title: t('connect.notice'),
            description: error?.message,
          })
        } finally {
          setIsConnecting(false)
        }
      }}
    />
  )
}
