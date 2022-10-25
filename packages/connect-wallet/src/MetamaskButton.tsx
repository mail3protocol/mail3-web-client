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
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import detectEthereumProvider from '@metamask/detect-provider'
import MetamaskPng from 'assets/wallets/metamask.png'
import {
  generateMetamaskDeepLink,
  isImTokenReject,
  isRejectedMessage,
} from 'shared/src/wallet'
import { isWechat } from 'shared/src/env'
import { ConnectButton, generateIcon } from './ConnectButton'

export const MetamaskButton: React.FC<{
  onClose?: () => void
}> = ({ onClose }) => {
  const [t] = useTranslation('common')
  const [isConnectingMetamask, setIsConnectingMetamask] = useState(false)
  const dialog = useDialog()
  const setLastConnector = useSetLastConnector()
  const connectorName = useLastConectorName()
  const isConnected = !!useAccount()
  const [shouldUseDeeplink, setShouldUseDeepLink] = useState(false)
  const setLoginInfo = useSetLoginInfo()
  const logout = () => setLoginInfo(null)
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

  return (
    <ConnectButton
      isDisabled={
        isConnectingMetamask ||
        (connectorName === ConnectorName.MetaMask && isConnected)
      }
      isLoading={isConnectingMetamask}
      text={t('connect.metamask')}
      icon={generateIcon(MetamaskPng)}
      href={shouldUseDeeplink ? generateMetamaskDeepLink() : undefined}
      isConnected={connectorName === ConnectorName.MetaMask && isConnected}
      onClick={async () => {
        trackWallet({
          [TrackKey.DesiredWallet]: DesiredWallet.MetaMask,
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
