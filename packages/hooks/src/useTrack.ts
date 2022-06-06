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
  HomeLaunchApp = 'mail3_offical_click_launchapp',
  HomeClickWhiteList = 'mail3_offical_click_whitelist',
  HomeClickJoinWhiteList = 'mail3_offical_click_jointhewhitelist',
  HomeClickTestingGo = 'mail3_offical_click_testinggo',
  HomeClickWhitePaper = 'mail3_offical_click_litepaper',
  HomeClickCommunity = 'mail3_offical_click_community',
  HomeClickGetIn = 'mail3_offical_click_getin',
  HomeClickContact = 'mail3_offical_click_contactus',

  // subscriptions
  ClickSubscriptionBell = 'click_subscription_bell',
  // mailboxes

  // mail detail
  ClickMailDetailsPageItem = 'click_mail_details_page_item',
}

// dimensions
export enum TrackKey {
  DesiredWallet = 'desired_wallet',
  CollectedAddress = 'collected_address',

  // whitelist
  WhiteListEntry = 'entered_whitelist',

  // home
  HomeCommunity = 'Mail3_offical_click_community',

  // mail detail
  MailDetailPage = 'click_mail_details_page_item',
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

export enum MailDetailPageItem {
  Reply = 'reply',
  Forward = 'Forward',
  Trash = 'Trash',
  Restore = 'Restore',
  Delete = 'Delete',
}

export interface TrackProps {
  [TrackKey.DesiredWallet]?: DesiredWallet
  [TrackKey.CollectedAddress]?: string
  [TrackKey.WhiteListEntry]?: boolean
  [TrackKey.HomeCommunity]?: HomeCommunity
  [TrackKey.MailDetailPage]?: MailDetailPageItem
}

export const useTrackClick = (event: TrackEvent) => (props?: TrackProps) => {
  try {
    gtag('event', event, props)
  } catch (error) {
    //
  }
}
