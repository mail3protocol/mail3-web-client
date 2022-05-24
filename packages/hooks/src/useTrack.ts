import { useDidMount } from './useDidMount'

export enum TrackEvent {
  DesiredWallet = 'desired_wallet',
}

export enum TrackKey {
  WalletName = 'wallet_name',
  CollectedAddress = 'collected_address',
}

export enum WalletName {
  Phantom = 'Phantom',
  Blocto = 'Blocto',
  MetaMask = 'MetaMask',
  WalletConnect = 'WalletConnect',
}

export interface TrackProps {
  [TrackKey.WalletName]?: WalletName
  [TrackKey.CollectedAddress]?: string
}

export const useTrackClick = (event: TrackEvent, props?: TrackProps) => () => {
  try {
    gtag('event', event, props)
  } catch (error) {
    //
  }
}

export const useTrackDidMount = (event: TrackEvent, props?: TrackProps) => {
  const track = useTrackClick(event, props)
  useDidMount(() => {
    track()
  })
}
