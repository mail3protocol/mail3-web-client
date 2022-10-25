import { useState } from 'react'
import {
  ConnectorName,
  DesiredWallet,
  TrackEvent,
  TrackKey,
  useAccount,
  useDialog,
  useDidMount,
  useSetLastConnector,
  useSetLoginInfo,
  useTrackClick,
} from 'hooks'
import detectEthereumProvider from '@metamask/detect-provider'
import { useTranslation } from 'react-i18next'
import { Connector, Web3ReactStore } from '@web3-react/types'
import { isWechat } from 'shared/src/env'
import { isRejectedMessage } from 'shared/src/wallet'

export interface useEthButtonProps {
  onClose?: () => void
  store: Web3ReactStore
  connector: Connector
  connectorName: ConnectorName
}

export function useEthButton({
  onClose,
  connectorName,
  store,
  connector,
}: useEthButtonProps) {
  const [t] = useTranslation('common')
  const [isConnecting, setIsConnecting] = useState(false)
  const dialog = useDialog()
  const setLastConnector = useSetLastConnector()
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
  const onClick = async () => {
    trackWallet({
      [TrackKey.DesiredWallet]: DesiredWallet.Coinbase,
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
    try {
      await connector.activate()
      const { error } = store.getState()
      if (error != null) {
        if (!isRejectedMessage(error)) {
          onClose?.()
          await dialog({
            type: 'warning',
            title: t('connect.notice'),
            description: error?.message,
          })
        }
      } else {
        logout()
        setLastConnector(connectorName)
        onClose?.()
      }
    } catch (error: any) {
      console.error(error)
    } finally {
      setIsConnecting(false)
    }
  }
  return {
    onClick,
    isConnected,
    isConnecting,
  }
}
