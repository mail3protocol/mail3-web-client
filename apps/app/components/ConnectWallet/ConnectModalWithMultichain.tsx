import {
  Heading,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Tabs,
  TabList,
  Tab,
  VStack,
  Box,
  Text,
  Image,
} from '@chakra-ui/react'
import React, { ReactNode, useMemo, useState } from 'react'
import { ConnectorName } from 'hooks'
import PhantomPng from 'assets/wallets/phantom.png'
import BloctoPng from 'assets/wallets/blocto.png'
import SolflarePng from 'assets/wallets/solflare.png'
import AvalancePng from 'assets/wallets/avalanche.png'
import TronPng from 'assets/wallets/tron.png'
import CoinbasePng from 'assets/wallets/coinbase.png'
import KeplrPng from 'assets/wallets/keplr.png'
import PolkawalletPng from 'assets/wallets/polkadot.png'
import { MetamaskButton } from './MetamaskButton'
import { WalletConnectButton } from './WalletConnectButton'
import AvaxIconPath from '../../assets/chain-icons/avax.png'
import EthIconPath from '../../assets/chain-icons/eth.png'
import FlowIconPath from '../../assets/chain-icons/flow.png'
import SolIconPath from '../../assets/chain-icons/sol.png'
import TronIconPath from '../../assets/chain-icons/tron.png'
import OtherIconPath from '../../assets/chain-icons/other.png'
import { PlaceholderButton } from './PlaceholderButton'
import { generateIcon } from './ConnectButton'

interface ChainItem {
  name: string
  icon: string
  description: ReactNode
  walletButtons: ReactNode[]
}

export const ConnectModalWithMultichain: React.FC<{
  isOpen: boolean
  onClose: () => void
}> = ({ isOpen, onClose }) => {
  const chains: ChainItem[] = useMemo(
    () => [
      {
        name: 'ETH',
        icon: EthIconPath,
        description: 'EVM compatible chain: Ethereum, Polygon, BSC',
        walletButtons: [
          <MetamaskButton key={ConnectorName.MetaMask} />,
          <WalletConnectButton key={ConnectorName.WalletConnect} />,
        ],
      },
      {
        name: 'Flow',
        icon: FlowIconPath,
        description: 'Coming soon',
        walletButtons: [
          <PlaceholderButton
            trackDesiredWalletKey="Blocto"
            key={ConnectorName.Blocto}
            text="Blocto"
            icon={generateIcon(BloctoPng)}
          />,
        ],
      },
      {
        name: 'Sol',
        icon: SolIconPath,
        description: 'Coming soon',
        walletButtons: [
          <PlaceholderButton
            trackDesiredWalletKey="Phantom"
            key={ConnectorName.Phantom}
            text="Phantom"
            icon={generateIcon(PhantomPng)}
          />,
          <PlaceholderButton
            trackDesiredWalletKey="Solflare"
            key={ConnectorName.Solflare}
            text="Solflare"
            icon={generateIcon(SolflarePng)}
          />,
        ],
      },
      {
        name: 'Avalance',
        icon: AvaxIconPath,
        description: 'Coming soon',
        walletButtons: [
          <PlaceholderButton
            trackDesiredWalletKey="Avalance"
            key={ConnectorName.Avalance}
            text="Avalance"
            icon={generateIcon(AvalancePng)}
          />,
        ],
      },
      {
        name: 'Tron',
        icon: TronIconPath,
        description: 'Coming soon',
        walletButtons: [
          <PlaceholderButton
            trackDesiredWalletKey="Tron"
            key={ConnectorName.TronLink}
            text="TronLink"
            icon={generateIcon(TronPng)}
          />,
        ],
      },
      {
        name: 'Others',
        icon: OtherIconPath,
        description: 'Coming soon',
        walletButtons: [
          <PlaceholderButton
            trackDesiredWalletKey="Coinbase"
            key={ConnectorName.Coinbase}
            text="Coinbase"
            icon={generateIcon(CoinbasePng)}
          />,
          <PlaceholderButton
            trackDesiredWalletKey="Keplr"
            key={ConnectorName.Keplr}
            text="Keplr"
            icon={generateIcon(KeplrPng)}
          />,
          <PlaceholderButton
            trackDesiredWalletKey="Plug"
            key={ConnectorName.Plug}
            text="Plug"
            icon={generateIcon(PhantomPng)}
          />,
          <PlaceholderButton
            trackDesiredWalletKey="Zilpay"
            key={ConnectorName.Zilpay}
            text="Zilpay"
            icon={generateIcon(PhantomPng)}
          />,
          <PlaceholderButton
            trackDesiredWalletKey="Polkawallet"
            key={ConnectorName.Polkawallet}
            text="Polkawallet"
            icon={generateIcon(PolkawalletPng)}
          />,
        ],
      },
    ],
    []
  )
  const [tabIndex, setTabIndex] = useState(0)
  const currentChain = chains[tabIndex]

  return (
    <Modal isOpen={isOpen} onClose={onClose} autoFocus={false} isCentered>
      <ModalOverlay />
      <ModalContent
        maxWidth="520px"
        rounded={{ base: 0, md: '24px' }}
        pt="24px"
        pb="32px"
      >
        <ModalCloseButton />
        <Heading fontSize="16px" lineHeight="24px" mb="32px" textAlign="center">
          Connect Your Wallet
        </Heading>
        <Tabs variant="unstyled" index={tabIndex} onChange={setTabIndex}>
          <TabList px="30px" overflowX="auto" overflowY="hidden">
            {chains.map((chain, index) => (
              <Tab
                key={chain.name}
                color={tabIndex === index ? '#000' : '#6F6F6F'}
                fontSize="14px"
                fontWeight={600}
                position="relative"
                pl="0"
                pb="7px"
                pr="16px"
                flexShrink={0}
              >
                <Image
                  src={chain.icon}
                  alt={chain.name}
                  w="16px"
                  h="16px"
                  objectFit="contain"
                  mr="2px"
                />
                {chain.name}
                <Box
                  position="absolute"
                  bottom="5px"
                  left="18px"
                  h="3px"
                  w="calc(100% - 18px - 16px)"
                  bg="#000"
                  rounded="5px"
                  opacity={tabIndex === index ? 1 : 0}
                  transition="200ms"
                />
              </Tab>
            ))}
          </TabList>
        </Tabs>
        <Box as="hr" borderColor="#E0E0E0" mx="30px" />
        <Box bg="#F3F3F3">
          <Text
            fontSize="12px"
            lineHeight="18px"
            color="#6F6F6F"
            textAlign="center"
            my="24px"
          >
            {currentChain.description}
          </Text>
          <VStack spacing="16px" align="center" minH="223px" mb="24px">
            {currentChain.walletButtons}
          </VStack>
        </Box>
      </ModalContent>
    </Modal>
  )
}
