import { useTranslation } from 'react-i18next'
import { ConnectorName, DesiredWallet, metaMask, metaMaskStore } from 'hooks'
import MetamaskPng from 'assets/wallets/metamask.png'
import { EthBaseButton } from './EthBaseButton'

export const MetamaskButton: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const { t } = useTranslation('components')
  return (
    <EthBaseButton
      trackDesiredWalletKey={DesiredWallet.MetaMask}
      connector={metaMask}
      web3ReactStore={metaMaskStore}
      connectorName={ConnectorName.MetaMask}
      icon={MetamaskPng}
      onClose={onClose}
    >
      {t('select_connect_wallet.wallets.metamask')}
    </EthBaseButton>
  )
}
