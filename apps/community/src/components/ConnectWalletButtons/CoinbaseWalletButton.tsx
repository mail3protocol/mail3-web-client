import { useTranslation } from 'react-i18next'
import { ConnectorName, DesiredWallet, coinbase, coinbaseStore } from 'hooks'
import CoinbaseWalletPng from 'assets/wallets/coinbase.png'
import { EthBaseButton } from './EthBaseButton'

export const CoinbaseWalletButton: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const { t } = useTranslation('components')
  return (
    <EthBaseButton
      trackDesiredWalletKey={DesiredWallet.Coinbase}
      connector={coinbase}
      web3ReactStore={coinbaseStore}
      connectorName={ConnectorName.Coinbase}
      icon={CoinbaseWalletPng}
      onClose={onClose}
    >
      {t('select_connect_wallet.wallets.coinbase')}
    </EthBaseButton>
  )
}
