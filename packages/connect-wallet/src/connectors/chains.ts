import type { AddEthereumChainParameter } from '@web3-react/types'

interface BasicChainInformation {
  urls: string[]
  name: string
}

interface ExtendedChainInformation extends BasicChainInformation {
  nativeCurrency: AddEthereumChainParameter['nativeCurrency']
  blockExplorerUrls: AddEthereumChainParameter['blockExplorerUrls']
}

function isExtendedChainInformation(
  chainInformation: BasicChainInformation | ExtendedChainInformation
): chainInformation is ExtendedChainInformation {
  return !!(chainInformation as ExtendedChainInformation).nativeCurrency
}

export const CHAINS: {
  [chainId: number]: BasicChainInformation | ExtendedChainInformation
} = {
  1: {
    urls: [
      // process.env.infuraKey
      //   ? `https://mainnet.infura.io/v3/${process.env.infuraKey}`
      //   : undefined,
      undefined,
      // process.env.NEXT_PUBLIC_ALCHEMY_KEY
      //   ? `https://eth-mainnet.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`
      //   : undefined,
      undefined,
      'https://cloudflare-eth.com',
    ].filter((url) => typeof url === 'string') as string[],
    name: 'Mainnet',
  },
}

export function getAddChainParameters(
  chainId: number
): AddEthereumChainParameter | number {
  const chainInformation = CHAINS[chainId]
  if (isExtendedChainInformation(chainInformation)) {
    return {
      chainId,
      chainName: chainInformation.name,
      nativeCurrency: chainInformation.nativeCurrency,
      rpcUrls: chainInformation.urls,
      blockExplorerUrls: chainInformation.blockExplorerUrls,
    }
  }
  return chainId
}

export const URLS: { [chainId: number]: string[] } = Object.keys(
  CHAINS
).reduce<{ [chainId: number]: string[] }>((accumulator, chainId) => {
  const validURLs: string[] = CHAINS[Number(chainId)].urls

  if (validURLs.length) {
    accumulator[Number(chainId)] = validURLs
  }

  return accumulator
}, {})
