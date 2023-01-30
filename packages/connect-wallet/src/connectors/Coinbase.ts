import { initializeConnector } from '@web3-react/core'
import { CoinbaseWallet } from '@web3-react/coinbase-wallet'
import { URLS } from './chains'

export const [coinbase, coinbaseHooks, coinbaseStore] = initializeConnector(
  (actions) =>
    // @ts-ignore
    new CoinbaseWallet(actions, {
      url: URLS['1'][0] as string,
      appName: 'Mail3',
      appLogoUrl: 'https://mail3.me/icons/icon-384x384.png',
    }),
  Object.keys(URLS).map((chainId) => Number(chainId))
)
