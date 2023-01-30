import {
  DesiredWallet,
  TrackEvent,
  TrackKey,
  useDialog,
  useDidMount,
  useSetLoginInfo,
  useTrackClick,
} from 'hooks'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import detectEthereumProvider from '@metamask/detect-provider'
import CoinbasePng from 'assets/wallets/coinbase.png'
import { isWechat } from 'shared/src/env'
import { generateMetamaskDeepLink, isRejectedMessage } from 'shared/src/wallet'
import {
  useLastConectorName,
  useSetLastConnector,
  useAccount,
  coinbase,
  coinbaseStore,
  ConnectorName,
} from './connectors'
import { ConnectButton, generateIcon } from './ConnectButton'

export const CoinbaseButton: React.FC<{
  onClose?: () => void
}> = ({ onClose }) => {
  const [t] = useTranslation('common')
  const [isConnecting, setIsConnecting] = useState(false)
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
        isConnecting ||
        (connectorName === ConnectorName.Coinbase && isConnected)
      }
      isLoading={isConnecting}
      text={t('connect.coinbase')}
      icon={generateIcon(CoinbasePng)}
      href={shouldUseDeeplink ? generateMetamaskDeepLink() : undefined}
      isConnected={connectorName === ConnectorName.Coinbase && isConnected}
      onClick={async () => {
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
          await coinbase.activate()
          const { error } = coinbaseStore.getState()
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
            setLastConnector(ConnectorName.Coinbase)
            onClose?.()
          }
        } catch (error: any) {
          //
        } finally {
          setIsConnecting(false)
        }
      }}
    />
  )
}
