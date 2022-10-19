import {
  ConnectorName,
  DesiredWallet,
  TrackEvent,
  TrackKey,
  useAccount,
  useDialog,
  useLastConectorName,
  useSetLastConnector,
  useSetLoginInfo,
  useTrackClick,
} from 'hooks'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Connector, Web3ReactStore } from '@web3-react/types'
import { BaseButton, BaseButtonProps } from './BaseButton'

export interface EthBaseButtonProps extends BaseButtonProps {
  onClose?: () => void
  trackDesiredWalletKey: DesiredWallet
  connector: Connector
  web3ReactStore: Web3ReactStore
  connectorName: ConnectorName
}

export const EthBaseButton: React.FC<EthBaseButtonProps> = ({
  onClose,
  trackDesiredWalletKey,
  connector,
  web3ReactStore,
  connectorName,
  children,
  ...props
}) => {
  const [t] = useTranslation('common')
  const dialog = useDialog()
  const setLastConnector = useSetLastConnector()
  const lastConnectorName = useLastConectorName()
  const isConnected = !!useAccount()
  const setLoginInfo = useSetLoginInfo()
  const logout = () => setLoginInfo(null)
  const trackWallet = useTrackClick(TrackEvent.ConnectWallet)
  const [isConnecting, setIsConnecting] = useState(false)

  return (
    <BaseButton
      isDisabled={lastConnectorName === connectorName && isConnected}
      isLoading={isConnecting}
      onClick={async () => {
        trackWallet({
          [TrackKey.DesiredWallet]: trackDesiredWalletKey,
        })
        setIsConnecting(true)
        try {
          await connector.activate()
          const { error } = web3ReactStore.getState()
          if (error) {
            throw error
          }
        } catch (error: any) {
          if (!error?.message?.includes('User closed modal')) {
            onClose?.()
            dialog({
              type: 'warning',
              title: t('connect.notice'),
              description: error?.message || t('connect.unknown_error'),
            })
          }
          logout()
        } finally {
          setLastConnector(connectorName)
          setIsConnecting(false)
          onClose?.()
        }
      }}
      {...props}
    >
      {children}
    </BaseButton>
  )
}
