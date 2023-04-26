export enum TrackEvent {
  // settings
  ClickImageSignature = 'click_image_signature_edit',
  ClickRegisterENS = 'click_register_new_ENS',
  ClickRegisterBIT = 'click_register_new_BIT',
  ClickRegisterUD = 'click_register_new_UD',
  ClickRegisterBNB = 'click_register_new_BNB',
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
  TestingSignupNow = 'beta1_click_register_it_now',

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

  // mailboxes
  ClickWrite = 'click_write',

  // mail detail
  ClickMailDetailsPageItem = 'click_mail_details_page_item',

  // app_edit_message
  AppEditMessageChangeFrom = 'click_from',
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
  ClickBITRefresh = 'click_BIT_refresh',

  // ipfs
  clickDInfoBlockchainLink = 'click_dinfo_blockchain_link',
  clickDInfoIpfsLink = 'click_dinfo_ipfs_link',

  // subscribe-btn
  ClickSubscribeOk = 'subscribe_click_notification_OK',
  ClickSubscribeAirOk = 'subscribe_default_click_notification_continue',
  ClickSubscribeVisit = 'subscribe_click_visit_mail3',
  ClickSubscribeAirVisit = 'subscribe_default_click_visit_mail3',

  // developers
  // mmb
  ClickMmbMirror = 'click_mmb_mirror',
  ClickMmbGithub = 'click_mmb_github',
  ClickSubMirror = 'click_subscribe_mirror',
  ClickSubGithub = 'click_subscribe_github',
  ClickSubBackend = 'click_subscribe_backend',
  // community
  ClickCommunity = 'click_community',

  // product recommendations
  ClickBannerSuggestion = 'click_banner_suggestion',
  SentProductSuggestion = 'sent_product_suggestion',

  ClickNotificationToastOk = 'click_notification_toast_ok',

  // experience users
  ExuserClickRegisterEns = 'exuser_click_register_ens',
  ExuserClickRegisterBit = 'exuser_click_register_bit',
  ExuserClickGotOne = 'exuser_click_got_one',

  CommunityClickNewMessage = 'click_new_message',
  CommunityClickCommunityPersonalcenter = 'click_community_personalcenter',
  CommunityClickInformationQRcodeDownload = 'click_information_QRcode_download',
  CommunityClickCommunitySendConfirm = 'click_community_send_confirm',
  // subscription
  ClickSubscribeNews = 'click_subscribe_news',
  ClickSubscribeNewsAvatar = 'click_subscribe_news_avatar',
  ClickUnsubscribe = 'click_unsubscribe',
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

  // testing
  TestingEntry = 'beta1_check_eligilibity',

  // subscribe-btn
  SubscribeBtnStatus = 'subscribe_to_visti_mail3',
  SubscribeBtnAirStatus = 'subscribe_default_click_visti_mail3',

  LitepaperLanguage = 'litepaper_language',

  CommunityClickCommunityPersonalcenterItem = 'click_community_personalcenter_item',

  CommunityQRcodeStyle = 'QRcode_style',
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
  Drafts = 'Drafts',
  Trash = 'Trash',
  Discord = 'Discord',
  Twitter = 'Twitter',
  Mirror = 'Mirror',
  Spam = 'Spam',
}

export enum SubscribeAction {
  Repeat = 'Repeat Subscription',
  Denial = 'Denial Notification',
  Already = 'Already Authorized Notification',
  Mobile = 'Mobile Subscription',
  MobileRepeat = 'Mobile Repeat Subscription',
}

export enum GlobalDimensions {
  OwnBnbAddress = 'own_bnb_address',
  OwnEnsAddress = 'own_ens_address',
  OwnBitAddress = 'own_bit_address',
  OwnBitSubDomain = 'own_bit_sub_domain',
  OwnUDAddress = 'own_ud_address',
  ConnectedWalletName = 'connected_wallet_name',
  WalletAddress = 'wallet_address',
  SignatureStatus = 'signature_status',
}

export enum DesiredWallet {
  Phantom = 'Phantom',
  Blocto = 'Blocto',
  MetaMask = 'MetaMask',
  WalletConnect = 'WalletConnect',
  Imtoken = 'imToken',
  Trust = 'Trust',
  ZilPay = 'ZilPay',
  Coinbase = 'Coinbase',
  Polkawallet = 'Polkawallet',
  Plug = 'Plug',
  Keplr = 'Keplr',
  Tron = 'Tron',
  Solflare = 'Solflare',
  UD = 'UD',
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
  ReplyAll = 'replyAll',
  Forward = 'Forward',
  Trash = 'Trash',
  Restore = 'Restore',
  Delete = 'Delete',
  Spam = 'Spam',
  NotSpam = 'NotSpam',
}

export enum CommunityQRcodeStyle {
  Mail3Style = 'mail3_style',
  PureStyle = 'pure_style',
}

export enum CommunityClickCommunityPersonalcenterItem {
  Information = 'Information',
  SubscriptionPage = 'SubscriptionPage',
  ChangeWallet = 'ChangeWallet',
  Disconnect = 'Disconnect',
}

export enum LitepaperLanguage {
  English = 'English',
  Japanese = 'Japanese',
  Chinese = 'Chinese',
}

export interface TrackProps {
  [TrackKey.DesiredWallet]?: DesiredWallet
  [TrackKey.CollectedAddress]?: string
  [TrackKey.WhiteListEntry]?: boolean
  [TrackKey.TestingEntry]?: boolean
  [TrackKey.HomeCommunity]?: HomeCommunity
  [TrackKey.MailDetailPage]?: MailDetailPageItem
  [TrackKey.PersonnalCenter]?: PersonnalCenter
  [TrackKey.ProfileScoialPlatform]?: ProfileScoialPlatformItem
  [TrackKey.Mail3MenuItem]?: Mail3MenuItem
  [TrackKey.LitepaperLanguage]?: LitepaperLanguage
  [TrackKey.CommunityClickCommunityPersonalcenterItem]?: CommunityClickCommunityPersonalcenterItem
  [TrackKey.CommunityQRcodeStyle]?: CommunityQRcodeStyle
  [TrackKey.SubscribeBtnStatus]?: SubscribeAction
  [TrackKey.SubscribeBtnAirStatus]?: SubscribeAction
}

export const useTrackClick = (event: TrackEvent) => (props?: TrackProps) => {
  try {
    gtag('event', event, props)
  } catch (error) {
    //
  }
}
