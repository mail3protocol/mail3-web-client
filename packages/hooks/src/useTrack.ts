export enum TrackEvent {
  // settings
  ClickImageSignature = 'click_image_signature_edit',
  ClickRegisterENS = 'click_register_new_ens',
  ClickCyperConnect = 'click_image_signature_edit_cyberconnect',

  // connect wallet
  ConnectWallet = 'Mail3_app_home_click_connectwallet',

  // whitelist
  WhiteListConnectWallet = 'earlybird_home_click_connectwallet',
  WhiteListMoreDetails = 'earlybird_click_moredetails',
  WhiteListDiscord = 'earlybird_click_joindiscord',
  WhiteListTwitter = 'earlybird_click_followtwitter',

  // home
  HomeLaunchApp = 'Mail3_offical_click_launchapp',
  HomeClickWhiteList = 'Mail3_offical_click_whitelist',
  HomeClickJoinWhiteList = 'Mail3_offical_click_jointhewhitelist',
  HomeClickTestingGo = 'Mail3_offical_click_testinggo',
  HomeClickWhitePaper = 'Mail3_offical_click_litepaper',
  HomeClickGetIn = 'Mail3_offical_click_getin',
  HomeClickContact = 'Mail3_offical_click_contactus',
}

// dimensions
export enum TrackKey {
  DesiredWallet = 'desired_wallet',
  CollectedAddress = 'collected_address',

  // whitelist
  WhiteListEntry = 'entered_whitelist',

  // home
  HomeCommunity = 'Mail3_offical_click_community',
}

export enum GlobalDimensions {
  OwnEnsAddress = 'own_ens_address',
  ConnectedWalletName = 'connected_wallet_name',
  WalletAddress = 'wallet_address',
  SignatureStatus = 'signature_status',
}

export enum DesiredWallet {
  Phantom = 'Phantom',
  Blocto = 'Blocto',
  MetaMask = 'MetaMask',
  WalletConnect = 'WalletConnect',
}

export enum SignatureStatus {
  BothEnabled = 'BothEnabled',
  OnlyText = 'OnlyText',
  OnlyImage = 'OnlyImage',
  BothDisabled = 'BothDisabled',
}

export enum HomeCommunity {
  Discord = 'discord',
  Twitter = 'twitter',
  Medium = 'medium',
  Mirror = 'mirror',
}

export interface TrackProps {
  [TrackKey.DesiredWallet]?: DesiredWallet
  [TrackKey.CollectedAddress]?: string
  [TrackKey.WhiteListEntry]?: boolean
  [TrackKey.HomeCommunity]?: HomeCommunity
}

export const useTrackClick = (event: TrackEvent) => (props?: TrackProps) => {
  try {
    gtag('event', event, props)
  } catch (error) {
    //
  }
}
