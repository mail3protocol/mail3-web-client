import { useTranslation } from 'react-i18next'
import {
  ConnectorName,
  DesiredWallet,
  walletConnect,
  walletConnectStore,
} from 'hooks'
import WalletConnectPng from 'assets/wallets/walletconnect.png'
import { EthBaseButton } from './EthBaseButton'

export const WalletConnectButton: React.FC = () => {
  const { t } = useTranslation('components')
  return (
    <EthBaseButton
      trackDesiredWalletKey={DesiredWallet.WalletConnect}
      connector={walletConnect}
      web3ReactStore={walletConnectStore}
      connectorName={ConnectorName.WalletConnect}
      icon={WalletConnectPng}
    >
      {t('select_connect_wallet.wallets.wallet_connect')}
    </EthBaseButton>
  )
}
