import { useDialog } from 'hooks'
import { useTranslation } from 'react-i18next'
import { ReactNode, useCallback, useState } from 'react'
import {
  Button,
  Tab,
  TabList,
  Tabs,
  VStack,
  Image,
  Box,
  Text,
} from '@chakra-ui/react'
import ZilliqaIconPath from 'assets/chain-icons/zilliqa.png'
import EthIconPath from 'assets/chain-icons/eth.png'
import FlowIconPath from 'assets/chain-icons/flow.png'
import SolIconPath from 'assets/chain-icons/sol.png'
import TronIconPath from 'assets/chain-icons/tron.png'
import OtherIconPath from 'assets/chain-icons/other.png'
import MetamaskPng from 'assets/wallets/metamask.png'
import WalletConnectPng from 'assets/wallets/walletconnect.png'

interface ChainItem {
  name: string
  icon: string
  description?: ReactNode
  walletButtons: ReactNode[]
}

export function useConnectWallet() {
  const dialog = useDialog()
  const { t } = useTranslation(['hooks', 'common'])
  const chains: ChainItem[] = [
    {
      name: 'ETH',
      icon: EthIconPath,
      walletButtons: [],
      description: t('connect_wallet_dialog.chain_descriptions.eth'),
    },
    {
      name: 'Zilliqa',
      icon: ZilliqaIconPath,
      walletButtons: [],
      description: t('connect_wallet_dialog.chain_descriptions.zilliqa'),
    },
    {
      name: 'Flow',
      icon: FlowIconPath,
      walletButtons: [],
      description: t('connect_wallet_dialog.chain_descriptions.flow'),
    },
    {
      name: 'Sol',
      icon: SolIconPath,
      walletButtons: [],
      description: t('connect_wallet_dialog.chain_descriptions.sol'),
    },
    {
      name: 'Tron',
      icon: TronIconPath,
      walletButtons: [],
      description: t('connect_wallet_dialog.chain_descriptions.tron'),
    },
    {
      name: 'Others',
      icon: OtherIconPath,
      walletButtons: [],
      description: t('connect_wallet_dialog.chain_descriptions.others'),
    },
  ]
  const [tabIndex, setTabIndex] = useState(0)
  const currentChain = chains[tabIndex]

  return useCallback(
    () =>
      dialog({
        title: t('connect_wallet', { ns: 'common' }),
        description: (
          <>
            <Tabs variant="chain" onChange={setTabIndex}>
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
              >
                {currentChain.description}
              </Text>
              <VStack spacing="16px">
                <Button
                  variant="wallet"
                  w="246px"
                  mx="auto"
                  leftIcon={<Image src={MetamaskPng} w="24px" h="24px" />}
                >
                  {t('connect_wallet_dialog.wallets.metamask')}
                </Button>
                <Button
                  variant="wallet"
                  w="246px"
                  mx="auto"
                  leftIcon={<Image src={WalletConnectPng} w="24px" h="24px" />}
                >
                  {t('connect_wallet_dialog.wallets.wallet_connect')}
                </Button>
              </VStack>
            </Box>
          </>
        ),
      }),
    [t, dialog]
  )
}
