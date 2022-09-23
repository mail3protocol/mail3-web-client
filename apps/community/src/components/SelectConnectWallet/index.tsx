import { useTranslation } from 'react-i18next'
import { Box, Image, Tab, TabList, Tabs, Text, VStack } from '@chakra-ui/react'
import { ConnectorName, DesiredWallet } from 'hooks'
import React, { ReactNode, useState } from 'react'
import ZilliqaIconPath from 'assets/chain-icons/zilliqa.png'
import EthIconPath from 'assets/chain-icons/eth.png'
import FlowIconPath from 'assets/chain-icons/flow.png'
import SolIconPath from 'assets/chain-icons/sol.png'
import TronIconPath from 'assets/chain-icons/tron.png'
import OtherIconPath from 'assets/chain-icons/other.png'
import ZilpayPng from 'assets/wallets/zilpay.png'
import BloctoPng from 'assets/wallets/blocto.png'
import PhantomPng from 'assets/wallets/phantom.png'
import SolflarePng from 'assets/wallets/solflare.png'
import TronPng from 'assets/wallets/tron.png'
import KeplrPng from 'assets/wallets/keplr.png'
import PolkawalletPng from 'assets/wallets/polkadot.png'
import PlugPng from 'assets/wallets/plug.png'
import { PlaceholderButton } from '../ConnectWalletButtons/PlaceholderButton'
import { WalletConnectButton } from '../ConnectWalletButtons/WalletConnectButton'
import { MetamaskButton } from '../ConnectWalletButtons/MetamaskButton'

interface ChainItem {
  name: string
  icon: string
  description?: ReactNode
  walletButtons: ReactNode[]
}

export const SelectConnectWallet: React.FC = () => {
  const { t } = useTranslation('components')
  const chains: ChainItem[] = [
    {
      name: 'ETH',
      icon: EthIconPath,
      walletButtons: [
        <MetamaskButton key={ConnectorName.MetaMask} />,
        <WalletConnectButton key={ConnectorName.WalletConnect} />,
      ],
      description: t('select_connect_wallet.chain_descriptions.eth'),
    },
    {
      name: 'Zilliqa',
      icon: ZilliqaIconPath,
      walletButtons: [
        <PlaceholderButton
          key={ConnectorName.Zilpay}
          icon={ZilpayPng}
          trackDesiredWalletKey={DesiredWallet.ZilPay}
        >
          {t('select_connect_wallet.wallets.zilpay')}
        </PlaceholderButton>,
      ],
      description: t('select_connect_wallet.chain_descriptions.zilliqa'),
    },
    {
      name: 'Flow',
      icon: FlowIconPath,
      walletButtons: [
        <PlaceholderButton
          key={ConnectorName.Blocto}
          trackDesiredWalletKey={DesiredWallet.Blocto}
          icon={BloctoPng}
        >
          {t('select_connect_wallet.wallets.blocto')}
        </PlaceholderButton>,
      ],
      description: t('select_connect_wallet.chain_descriptions.flow'),
    },
    {
      name: 'Sol',
      icon: SolIconPath,
      walletButtons: [
        <PlaceholderButton
          trackDesiredWalletKey={DesiredWallet.Phantom}
          key={ConnectorName.Phantom}
          icon={PhantomPng}
        >
          {t('select_connect_wallet.wallets.phantom')}
        </PlaceholderButton>,
        <PlaceholderButton
          trackDesiredWalletKey={DesiredWallet.Solflare}
          key={ConnectorName.Solflare}
          icon={SolflarePng}
        >
          {t('select_connect_wallet.wallets.solflare')}
        </PlaceholderButton>,
      ],
      description: t('select_connect_wallet.chain_descriptions.sol'),
    },
    {
      name: 'Tron',
      icon: TronIconPath,
      walletButtons: [
        <PlaceholderButton
          trackDesiredWalletKey={DesiredWallet.Tron}
          key={ConnectorName.TronLink}
          icon={TronPng}
        >
          {t('select_connect_wallet.wallets.tron_link')}
        </PlaceholderButton>,
      ],
      description: t('select_connect_wallet.chain_descriptions.tron'),
    },
    {
      name: 'Others',
      icon: OtherIconPath,
      walletButtons: [
        <PlaceholderButton
          trackDesiredWalletKey={DesiredWallet.Keplr}
          key={ConnectorName.Keplr}
          icon={KeplrPng}
        >
          {t('select_connect_wallet.wallets.keplr')}
        </PlaceholderButton>,
        <PlaceholderButton
          trackDesiredWalletKey={DesiredWallet.Plug}
          key={ConnectorName.Plug}
          icon={PlugPng}
        >
          {t('select_connect_wallet.wallets.plug')}
        </PlaceholderButton>,
        <PlaceholderButton
          trackDesiredWalletKey={DesiredWallet.Polkawallet}
          key={ConnectorName.Polkawallet}
          icon={PolkawalletPng}
        >
          {t('select_connect_wallet.wallets.polkawallet')}
        </PlaceholderButton>,
      ],
      description: t('select_connect_wallet.chain_descriptions.others'),
    },
  ]
  const [tabIndex, setTabIndex] = useState(0)
  const currentChain = chains[tabIndex]

  return (
    <>
      <Tabs variant="chain" onChange={setTabIndex} index={tabIndex}>
        <TabList
          w="calc(100% + 40px)"
          ml="-20px"
          pl="20px"
          overflowX="scroll"
          overflowY="hidden"
          userSelect="none"
        >
          {chains.map((chain) => (
            <Tab key={chain.name}>
              <Image
                src={chain.icon}
                alt={chain.name}
                w="16px"
                h="16px"
                pointerEvents="none"
              />
              {chain.name}
            </Tab>
          ))}
        </TabList>
      </Tabs>
      <Box
        bg="containerBackground"
        w="calc(100% + 40px)"
        minH="277px"
        ml="-20px"
        px="20px"
        pt="20px"
      >
        <Text
          fontSize="12px"
          textAlign="center"
          color="secondaryTitleColor"
          mb="32px"
          minH="18px"
        >
          {currentChain.description}
        </Text>
        <VStack spacing="16px">{currentChain?.walletButtons}</VStack>
      </Box>
    </>
  )
}
