export enum TrackEvent {
  // settings
  ClickImageSignature = 'click_image_signature_edit',
  ClickRegisterENS = 'click_register_new_ENS',
  ClickCyperConnect = 'click_image_signature_edit_cyberconnect',
  ClickAddressNext = 'click_guide_your_email_address_next',
  ClickSignatureNext = 'click_show_your_own_signature_next',

  // setup
  ClickShareYourNext = 'click_share_your_mail3_address_next',
  ClickGuideTwitter = 'click_guide_share_on_twitter',
  ClickGuideDownloadCard = 'click_guide_share_profile_card',
  ClickGuideCopy = 'click_guide_copy_profile_url',

  // profile
  ClickProfileLaunchApp = 'click_profile_launch_app',
  ClickProfileTwitter = 'click_profile_share_on_twitter',
  ClickProfileCopy = 'click_profile_copy_profile_url',
  ClickProfileDownloadCard = 'click_profile_share_profile_card',
  ClickProfileMailMe = 'click_profile_mail_me',
  ClickProfileScoialPlatform = 'click_profile_social_platform',

  // navbar
  ClickPersonalCenter = 'click_personalcenter',
  ClickMail3Menu = 'click_mail3_menu',

  // mail tracking
  OpenJoinMail3Dao = 'open_join_mail3_dao',
  OpenShowYourMail3NFT = 'open_show_your_mail3_nft',
  OpenUpdateMail = 'open_update_mail',
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
  HomeLaunchApp = 'Mail3_offical_click_launchapp',
  HomeClickWhiteList = 'mail3_offical_click_whitelist',
  HomeClickJoinWhiteList = 'mail3_offical_click_jointhewhitelist',
  HomeClickTestingGo = 'mail3_offical_click_testinggo',
  HomeClickWhitePaper = 'mail3_offical_click_litepaper',
  HomeClickCommunity = 'mail3_offical_click_community',
  HomeClickGetIn = 'Mail3_offical_click_getin',
  HomeClickContact = 'mail3_offical_click_contactus',
  HomeClickGoTesting = 'Mail3_offical_click_testinggo',
  HomeClickBlackCube = 'mail3_offical_click_blackcube',

  // subscriptions
  ClickSubscriptionBell = 'click_subscription_bell',
  MediaSubscriptions = 'media_subscriptions',
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

  // driftbottle
  ClickDriftbottleBanner = 'click_driftbottle_banner',
  ReplyDriftbottle = 'reply_driftbottle_mail',
  SendDriftbottleMail = 'send_driftbottle_mail',
  OpenDriftbottleMail = 'open_driftbottle_mail',

  ClickENSRefresh = 'click_ENS_refresh',

  // ipfs
  clickDInfoBlockchainLink = 'click_dinfo_blockchain_link',
  clickDInfoIpfsLink = 'click_dinfo_ipfs_link',

  // mmb
  ClickMmbMirror = 'click_mmb_mirror',
  ClickMmbGithub = 'click_mmb_github',
}

// dimensions
export enum TrackKey {
  DesiredWallet = 'desired_wallet',
  CollectedAddress = 'collected_address',

  // navbar
  PersonnalCenter = 'click_personalcenter_item',
  Mail3MenuItem = 'click_mail3_menu_item',

  // whitelist
  WhiteListEntry = 'entered_whitelist',

  // home
  HomeCommunity = 'Mail3_offical_click_community',
  // home profile
  ProfileScoialPlatform = 'visit_social_platform',

  // mail detail
  MailDetailPage = 'click_mail_details_page_item',

  // subscriptions
  SubscriptionBell = 'click_subscription_bell',
  MediaSubscriptions = 'media_subscriptions',
  // testing
  TestingEntry = 'beta1_check_eligilibity',
}

export enum ProfileScoialPlatformItem {
  CyberConnect = 'CyberConnect',
  Etherscan = 'Etherscan',
}

export enum PersonnalCenter {
  Settings = 'Settings',
  MyProfileLink = 'My Profile Link',
  MyMail3Address = 'My mail3 Address',
  ChangeWallet = 'Change Wallet',
  Logout = 'Logout',
}

export enum Mail3MenuItem {
  Inbox = 'Inbox',
  Sent = 'Sent',
  Subscription = 'Subscription',
  Drafts = 'Drafts',
  Trash = 'Trash',
  Discord = 'Discord',
  Twitter = 'Twitter',
  Mirror = 'Mirror',
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

export const MediaSubscriptionsItem: Record<number, string> = {
  0: 'Mail3',
  1: 'Bankless',
  2: 'The Defiant',
  3: 'Week in Ethereum News',
  4: 'Mirror Curator DAO',
  5: 'Arthur Hayes',
  6: 'CryptoJobsList',
  7: 'Web3 Jobs',
}

export interface TrackProps {
  [TrackKey.DesiredWallet]?: DesiredWallet
  [TrackKey.CollectedAddress]?: string
  [TrackKey.WhiteListEntry]?: boolean
  [TrackKey.TestingEntry]?: boolean
  [TrackKey.HomeCommunity]?: HomeCommunity
  [TrackKey.MailDetailPage]?: MailDetailPageItem
  [TrackKey.SubscriptionBell]?: string
  [TrackKey.MediaSubscriptions]?: string
  [TrackKey.PersonnalCenter]?: PersonnalCenter
  [TrackKey.ProfileScoialPlatform]?: ProfileScoialPlatformItem
  [TrackKey.Mail3MenuItem]?: Mail3MenuItem
}

export const useTrackClick = (event: TrackEvent) => (props?: TrackProps) => {
  try {
    gtag('event', event, props)
  } catch (error) {
    //
  }
}
