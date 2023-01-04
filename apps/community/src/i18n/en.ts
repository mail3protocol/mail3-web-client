export default {
  common: {
    no_mail3: 'No Mail3? ',
    register: 'Claim it now! ',
    connect_wallet: 'Connect Wallet',
    connect: {
      notice: 'Notice',
      unknown_error: 'Unknown error',
      metamask: 'MetaMask',
      'wallet-connect': 'Wallet Connect',
      zilpay: 'ZilPay',
      'dialog-title': 'Connect Your Wallet',
      'connect-wallet': 'Connect Wallet',
      phantom: 'Phantom',
      ud: 'Unstoppable Domains',
      blocto: 'Blocto',
      connecting: 'Connecting',
      'coming-soon': 'Coming soon',
      'desired-wallet':
        'Click on the wallet below and let us know which one you need more',
      footer:
        'We do not own your private keys and cannot access your assets without your confirmation.',
      'imtoken-reject':
        'You have declined authorization, please refresh this page to authorize again.',
      wechat:
        'The current environment does not support metamask. You can connect Metamask in the browser.',
      coinbase: 'Coinbase',
    },
    auth: {
      sign: "I authorize sending and checking my emails on mail3 from this device. This doesn't cost anything.",
      errors: {
        'wallet-not-connected':
          'Wallet is not connected, please connect your wallet',
        unknown: 'Unknown error, please try again later',
        'condition-not-meet':
          'You do not have permission to participate in Beta testing.',
      },
      connect: 'Connect your Wallet',
      desc: 'Skip approving every interaction with your wallet by allowing Mail3 to remember you.',
      remember: 'Check',
      'check-wallet': 'Check Wallet',
    },
    ud: {
      title: 'Connect Wallet',
      connect: 'Connect',
      reconnect: 'Reconnect Wallet',
      'connect-wallet-desc':
        'Please connect your wallet with account: {{address}}',
      'error-1':
        'The selected account ({{address}}) is not associated with domain {{domain}}.',
      'error-2': 'The expected account for this domain is {{address}}.',
      'error-3':
        'Please check your wallet settings to ensure you have connected the correct Ethereum account.',
    },
    no_data: 'No Data',
    all_loaded: 'All Loaded',
    loading: 'Loading……',
    unknown_error: 'Unknown error',
    copy_succeed: 'Copy Succeed!',
    send_time_limit: 'You can send 1 message a day. Please try it later.',
    upload_failed: 'Upload failed, reason: {{message}}',
    upload_succeed: 'Upload Succeed!',
    copied: 'Copied',
    copy: 'Copy',
    need_open_earn_nft_dialog: {
      title: '👉Notice',
      description: 'Please enable "subscribe-to-earn" feature',
      confirm: 'Confirm',
    },
  },
  components: {
    header: {
      logo_name: 'Subscription',
    },
    sidebar: {
      message: 'Message',
      subscribe: 'Subscribe',
      home: 'Home',
      send_records: 'History',
      earn_nft: 'Earn NFT',
    },
    tips_panel: {
      title: 'Help',
    },
    select_connect_wallet: {
      description: 'Please select the wallet.',
      wallets: {
        metamask: 'Metamask',
        wallet_connect: 'Wallet Connect',
        coinbase: 'Coinbase Wallet',
        zilpay: 'Zilpay',
        blocto: 'Blocto',
        phantom: 'Phantom',
        solflare: 'Solflare',
        tron_link: 'TronLink',
        keplr: 'Keplr',
        plug: 'Plug',
        polkawallet: 'Polkawallet',
      },
      chain_descriptions: {
        eth: 'EVM compatible chain: Ethereum, Polygon, BSC',
        zilliqa: '',
        flow: 'Coming soon',
        sol: 'Coming soon',
        tron: 'Coming soon',
        others: 'Coming soon',
      },
    },
    auth_connect_wallet: {
      description:
        'Skip approving every interaction with your wallet by allowing Mail3 to remember you.',
      remember: 'Check',
    },
    connect_wallet_button: {
      information: 'Account',
      change_wallet: 'Change Wallet',
      disconnect: 'Disconnect',
    },
    editor_menus: {
      link_button: {
        add_link: 'Add Link',
        add_link_input_placeholder: 'Link URL',
        ok: 'OK',
        invalid_url: 'Invalid url',
        only_supported_https: 'Only support https',
      },
    },
  },
  hooks: {
    register_dialog: {
      title: 'Apply for your Web3 Subscription',
      description: `Please click the "mail<sup>3</sup> me" button below to submit your application. It may take some time for your application to receive a response.`,
      no_white_list_description:
        'If you would like to apply for access to "mail<sup>3</sup> Community". <br/><br/>Please visit mail<sup>3</sup> official website to claim your Mail3 first.',
      register_mail_default_subject: '[Apply for Mail3 Community whitelist]',
      continue: 'Continue',
    },
  },
  new_message: {
    subject: 'Subject',
    subject_limit: '{{count}} / {{limit}}',
    editor_placeholder: 'Start writing here...',
    preview: 'Preview',
    send: 'Send',
    sending: 'Sending...',
    edit: 'Edit',
    send_succeed: 'Message Sent',
    send_failed: 'Send failed, reason: {{message}}',
    mail_image_limit:
      'The total image size of this message cannot exceed {{size}}',
    send_confirm: 'Please confirm you want to send this message',
    send_description: 'Do you want to send this message to subscriber?',
    confirm: 'Confirm',
    unsubscribe: 'Unsubscribe',
    successfully_sent: {
      title: 'Successfully sent',
      description: 'About to exit this page',
      confirm: 'Confirm',
    },
    ok: 'OK',
    abstract_holder:
      'The abstract will be displayed on your subscribe page to help subscribers quickly understand the content, if not filled in, it will not be displayed.',
  },
  dashboard: {
    message: 'Message',
    subscribers: 'Subscribers',
    new_subscribers: 'New Subscribers',
    statistics_time: 'Statistics time: Yesterday 00:00 - 24:00',
    send_message: 'Send Message',
    send_records: 'History',
    send_records_tooltip: 'Show 10 sent messages recently',
    view_all_send_records: 'All history',
    download_failed: 'Download failed, reason: {{message}}',
    download_no_data: 'No data, unable to download.',
  },
  earn_nft: {
    title: 'Subscribe To Earn',
    to_earn: 'To Earn',
    nft: 'NFT',
    distribution_platform: 'Distribution Platform',
    platforms: {
      galaxy: 'Galxe',
      quest3: 'Quest3',
    },
    campaign_link_field: 'Campaign Link',
    campaign_link_placeholder: 'Campaign Link',
    quest_link_field: 'Quest Link',
    quest_link_placeholder: 'Quest Link',
    go_to_galaxy_description:
      'Go to <a>Galxe</a> to create a marketing campaign and get the campaign link.',
    go_to_quest3_description:
      'Go to <a>Quest3</a> to create a quest and get the quest link.',
    credential_id: 'Credential ID',
    credential_id_placeholder: 'Credential ID',
    access_token: 'Access Token',
    access_token_placeholder: 'Access Token',
    enable: 'Enable',
    disable: 'Disable',
    subscription_style_preview: {
      title: 'Subscription dialog style preview',
      description: '<p>Click “Get the Code” button to copy the code.</p>',
      preview_subtitle: 'style preview',
      customize_the_button: 'Customize the button',
      get_the_code: 'Get the code',
    },
    earn_nft: '🎁 Earn NFT',
    coming_soon: 'Coming soon',
    subscribe: 'Subscribe',
    update_failed: 'Setup failed, reason: {{message}}',
    update_succeed: 'Setup succeed!',
    illegal_error_message:
      'The value you filled in is not legal, please check and modify.',
    // language=html
    help_galxe: `<h3>What is Subscribe To Earn?</h3>
           <ul>
             <li>
               Subscribe to earn can help you create an automated campaign to motivate users to subscribe to your project.
             </li>
             <li>
               <p>Only a few simple steps are needed:</p>
               <ol>
                 <li>Create a Campaign/Quest on the supported platform;</li>
                 <li>Follow the guide to complete the configuration below;</li>
                 <li>Get the code to integrate into your website or product.</li>
                 <li>Please make sure that the Credential ID you fill in corresponds to the Campaign Link.</li>
               </ol>
             </li>
           </ul>
           <h3>How to get the Credential ID?</h3>
           <ul>
             <li>
             As a Galxe resident project party, you can obtain your Credential ID by following the path: [Click on Avatar] > [Curated Credentials] > [Create] > [Select Type: Import Your Own Data] > [ID Type: EVM Address]>[Credential Source: CSV]>[Fill in the other necessary information and create Credential] > [Create]
             </li>
             <li>
               You can see the URL in the browser address bar of the successfully created Credential web page, for example: galxe.com/credential/20193934911****190
             </li>
             <li>
               Get [Credential ID]: 20193934911****190
             </li>
           </ul>
           <h3>How to get the Access Token?</h3>
           <ul>
             <li>
               As a Galxe inbound project party, you can get your Access Token through the following path: [Click on avatar] > [Setting] > [Access Token]
             </li>
             <li>
               For example: gbt****FgD3.
             </li>
             <li>
               Get [Access Token]: gbt****FgD3
             </li>
             <li>
               Please note: You need to synchronize and update the new Access Token to Mail3 community after each refresh to avoid possible error
             </li>
           </ul>
    `,
    // language=html
    help_quest3: `<h3>What is Subscribe To Earn?</h3>
           <ul>
             <li>
               Subscribe to earn can help you create an automated campaign to motivate users to subscribe to your project.
             </li>
             <li>
               <p>Only a few simple steps are needed:</p>
               <ol>
                 <li>Create your rewards on a supported platform (Galxe or Quest3);</li>
                 <li>Follow the guide to complete the configuration below;</li>
                 <li>Get the code to integrate into your website or product.</li>
                 <li>Please make sure that the Credential ID you fill in corresponds to the Campaign Link.</li>
               </ol>
             </li>
           </ul>
    `,
    enable_confirm: {
      title: 'Please confirm this operation!',
      description:
        '<p>Please evaluate whether your OAT/NFT issuance is in line with your expectation before enabling it, to avoid users not being able to collect their rewards due to insufficient issuance.</p><br/><p>Make sure your Project Galaxy campaign is active and started before enabling it.</p>',
      confirm: 'Confirm',
    },
    disable_confirm: {
      title: 'Please confirm this operation!',
      description:
        'Please make sure you have adjusted the "Subscribe To Earn" dialog on your website or product integration before deactivating "Subscribe To Earn" to avoid situations where users cannot receive rewards after subscription.',
      confirm: 'Confirm',
    },
    status_field: 'Status: ',
    status_value: {
      disabled: 'Disabled',
      enabled: 'Enabled',
      loading: 'Loading',
    },
    error_messages: {
      duplicated_parameter: 'Duplicated parameter',
      invalid_parameter: 'Invalid parameter',
      invalid_something: 'Invalid {{something}}',
      duplicated_something: 'Duplicated {{something}}',
    },
  },
  login_home_page: {
    say_hi: 'Hello! Friends',
    title: 'Welcome to\nMail3 Subscription!',
    join_community: 'Join community',
    join_discord: 'Join Discord',
    follow_twitter: 'Follow Twitter',
  },
  user_information: {
    name_field: 'Name',
    name_placeholder: 'Mail3.eth',
    address_field: 'Mail<sup>3</sup> Address',
    address_placeholder: 'robert@mail.com',
    profile_page_field: 'Profile Page',
    qr_code: 'Profile QR Code',
    download: 'Download',
    title: 'Account',
    collection_rank: 'Collection Rank',
    collected: 'Collected',
    tabs: {
      Profile: 'Profile',
      Items: 'Items',
      Basic_info: 'Basic info',
    },
    banner_image: 'Banner image',
    subscribe_link: 'Subscription page',
    avatar: 'Avatar',
    avatar_p:
      'Your profile avatar, which currently only supports synchronization with mail3`s avatar.',
    avatar_setting:
      'To change it, please go to your personal center in <a>Mail3: </a><span>Setting->Set Your Avatar</span>',
    upload: {
      button: 'Upload',
      remove: 'Remove',
      prompt:
        'For the best results on all devices, <br> use an image that’s at least <span>2440 x 400 px</span> and <span>5MB</span> or less.',
      appear:
        'This image will appear across the top of your subscription page. ',
    },
    cluster3_Link: 'Cluster3 Community Page Link',
    appear:
      'This will appear on the <span>Items</span> section of your Subscription Page.',
    appear_text: `
    Please go to <a>Cluscer3</a> search your project name, enter your project profile page,<br> <b>copy the Url (Like: https://rank.cluster3.net/community/1373)</b> of the page and fill it in here, we will automatically show you the poap you have released, please make sure the url is yours.`,
    display_Mail_Me_Button: 'Display Mail Me Button on the Subscription Page',
    publish: 'Publish',
    description: 'Description',
    description_placeholder: 'Description',
    // language=html
    help_qr_code: `<h3>Profile QR Code</h3>
        <p>Download profilepage card or QR code for promotion and sharing.</p>
 `,
    pixels: 'Images must be at least <span>2440X400</span> pixels',
    exceed: 'Images should not exceed <span>5M</span>',
  },
  send_message: {
    title: 'History',
    new_message: 'New Message',
  },
}
