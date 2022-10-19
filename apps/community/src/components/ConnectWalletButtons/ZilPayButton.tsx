import {
  ConnectorName,
  DesiredWallet,
  TrackEvent,
  TrackKey,
  useDialog,
  useLastConectorName,
  useSetLastConnector,
  useTrackClick,
  zilpay,
} from 'hooks'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ZilpayPng from 'assets/wallets/zilpay.png'

import { useIsAuthenticated } from '../../hooks/useLogin'
import { BaseButton } from './BaseButton'

export const ZilPayButton: React.FC<{
  onClose?: () => void
}> = ({ onClose }) => {
  const [t] = useTranslation(['common', 'components'])
  const dialog = useDialog()
  const [isConnecting, setIsConnecting] = useState(false)
  const setLastConnector = useSetLastConnector()
  const connectorName = useLastConectorName()
  const isConnected = useIsAuthenticated()

  const trackWallet = useTrackClick(TrackEvent.ConnectWallet)

  return (
    <BaseButton
      icon={ZilpayPng}
      isLoading={isConnecting}
      isDisabled={
        isConnecting || (connectorName === ConnectorName.Zilpay && isConnected)
      }
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
    >
      {t('select_connect_wallet.wallets.zilpay', { ns: 'components' })}
    </BaseButton>
  )
}
