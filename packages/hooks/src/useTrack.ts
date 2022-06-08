export enum TrackEvent {
  // settings
  ClickImageSignature = 'click_image_signature_edit',
  ClickRegisterENS = 'click_register_new_ens',
  ClickCyperConnect = 'click_image_signature_edit_cyberconnect',
  ClickAddressNext = 'click_guide_your_email_address_next',
  ClickSignatureNext = 'click_show_your_own_signature_next',

  // connect wallet
  ConnectWallet = 'Mail3_app_home_click_connectwallet',

  // whitelist
  WhiteListConnectWallet = 'earlybird_home_click_connectwallet',
  WhiteListMoreDetails = 'earlybird_click_moredetails',
  WhiteListDiscord = 'earlybird_click_joindiscord',
  WhiteListTwitter = 'earlybird_click_followtwitter',

  // testing
  TestingConnectWallet = 'beta1_home_click_connectwallet',
  TestingMoreDetails = 'beta1_click_moredetails',
  TestingDiscord = 'beta1_click_joindiscord',
  TestingDisCordLink = 'beta1_click_discord',
  TestingTwitter = 'beta1_click_followtwitter',
  TestingEnterApp = 'beta1_click_enterapp',

  // home
  HomeLaunchApp = 'mail3_offical_click_launchapp',
  HomeClickWhiteList = 'mail3_offical_click_whitelist',
  HomeClickJoinWhiteList = 'mail3_offical_click_jointhewhitelist',
  HomeClickTestingGo = 'mail3_offical_click_testinggo',
  HomeClickWhitePaper = 'mail3_offical_click_litepaper',
  HomeClickCommunity = 'mail3_offical_click_community',
  HomeClickGetIn = 'mail3_offical_click_getin',
  HomeClickContact = 'mail3_offical_click_contactus',
  HomeClickGoTesting = 'Mail3_offical_click_testinggo',
  HomeClickBlackCube = 'mail3_offical_click_blackcube',

  // subscriptions
  ClickSubscriptionBell = 'click_subscription_bell',
  // mailboxes
  ClickWrite = 'click_write',

  // mail detail
  ClickMailDetailsPageItem = 'click_mail_details_page_item',

  // app_edit_message
  AppEditMessageChangeFrom = 'click_from',
  AppEditMessageClickCommunity = 'click_community',
  AppEditMessageClickCommunityApply = 'click_community_apply',
  AppEditMessageClickCommunityNoThanks = 'click_community_nothanks',
  AppEditMessageClickSave = 'click_save',
  AppEditMessageClickSend = 'click_send',
  AppEditMessageClickAttachFiles = 'click_attachfiles',
  AppEditMessageClickCC = 'click_cc',
  AppEditMessageClickBCC = 'click_bcc',
  AppEditMessageClickMobileCCAndBCC = 'click_mobile_cc_bcc',
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

  // subscriptions
  SubscriptionBell = 'click_subscription_bell',
  // testing
  TestingEntry = 'beta1_check_eligilibity',
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
  [TrackKey.TestingEntry]?: boolean
  [TrackKey.HomeCommunity]?: HomeCommunity
  [TrackKey.MailDetailPage]?: MailDetailPageItem
  [TrackKey.SubscriptionBell]?: string
}

export const useTrackClick = (event: TrackEvent) => (props?: TrackProps) => {
  try {
    gtag('event', event, props)
  } catch (error) {
    //
  }
}
