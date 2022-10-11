export default {
  common: {
    no_mail3: 'No mail3? ',
    register: 'Register it now',
    connect_wallet: 'Connect Wallet',
    connect: {
      notice: 'Notice',
      unknown_error: 'Unknown error',
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
    },
    no_data: 'No Data',
  },
  components: {
    header: {
      logo_name: 'Community',
    },
    sidebar: {
      message: 'Message',
      subscribe: 'Subscribe',
      home: 'Home',
      send_records: 'Send Records',
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
        zilliqa: 'Coming soon',
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
      information: 'Information',
      change_wallet: 'Change Wallet',
      disconnect: 'Disconnect',
    },
    editor_menus: {
      link_button: {
        add_link: 'Add Link',
        add_link_input_placeholder: 'Link URL',
        ok: 'OK',
      },
    },
  },
  hooks: {
    register_dialog: {
      title: '😔 Sorry you are not qualified!',
      description: `If you would like to apply for access to "mail<sup>3</sup> Community". \n Please send us an email via the "Mail me" button below, telling us about your project, <span>your needs and your contact information</span>, and we will contact you after evaluation.`,
    },
  },
  new_message: {
    subject: 'Subject',
    subject_limit: '{{count}} / {{limit}}',
    editor_placeholder: 'Start writing here...',
    preview: 'Preview',
    send: 'Send',
    edit: 'Edit',
  },
  dashboard: {
    message: 'Message',
    subscribers: 'Subscribers',
    new_subscribers: 'New Subscribers',
    statistics_time: 'Statistics time: Yesterday 00:00 - 24:00',
    send_message: 'Send Message',
    send_records: 'Send Records',
    send_records_tooltip: 'Show 10 sent messages recently',
    view_all_send_records: 'View all send records',
  },
  earn_nft: {
    title: 'Subscribe To Earn NFT',
    to_earn: 'To Earn',
    nft: 'NFT',
    distribution_platform: 'Distribution Platform',
    platforms: {
      galaxy: 'Project Galaxy',
      quest3: 'Quest3',
    },
    campaign_link_field: 'Campaign Link',
    campaign_link_placeholder: 'campaign Link',
    go_to_galaxy_description:
      'Go to <a>Project Galaxy</a> to create a marketing campaign and get the campaign link.',
    credential_id: 'Credential ID',
    credential_key: 'Credential Key',
    enable: 'Enable',
    subscription_style_preview: {
      title: 'Subscription dialog style preview',
      description_1:
        'Edit the code area on the right to preview the style of the dialog box you want and get the code',
      description_2:
        'Read the development documentation to learn how to integrate: <a>How to integrate subscribe to earn</a>',
      preview_subtitle: 'style preview',
      customize_the_button: 'Customize the button',
      get_the_code: 'Get the code',
    },
    earn_nft: '🎁 Earn NFT',
    subscribe: 'Subscribe',
  },
  login_home_page: {
    'Hello! Friends': 'Hello! Friends',
    'Welcome to\nmail3 Community!': 'Welcome to\nmail3 Community!',
    'Connect Wallet': 'Connect wallet',
    join_community: 'Join community',
    join_discord: 'Join Discord',
    follow_twitter: 'Follow Twitter',
  },
  user_information: {
    name_field: 'Name',
    name_placeholder: 'Mail3.eth',
    address_field: 'Mail<sup>3</sup> Address',
    address_placeholder: 'robert@mail.com',
    qr_code: 'Profile QR Code',
    download: 'Download',
    title: 'Account Information',
  },
  send_message: {
    title: 'Send Records',
    new_message: 'New Message',
  },
}
