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
    all_loaded: 'All Loaded',
    loading: 'Loading……',
    unknown_error: 'Unknown error',
    copy_succeed: 'Copy Succeed!',
    send_time_limit:
      'Only one message can be sent within 24 hours, please try again later.',
    upload_failed: 'Upload failed, reason: {{message}}',
    upload_succeed: 'Upload Succeed!',
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
    send_succeed: 'Send Succeed!',
    send_failed: 'Send failed, reason: {{message}}',
    mail_image_limit:
      'The total image size of this message cannot exceed {{size}}',
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
    download_failed: 'Download failed, reason: {{message}}',
    download_no_data: 'No data, unable to download.',
  },
  earn_nft: {
    title: 'Subscribe To Earn NFT',
    to_earn: 'To Earn',
    nft: 'NFT',
    distribution_platform: 'Distribution Platform',
    platforms: {
      galaxy: 'Galxe',
      quest3: 'Quest3',
    },
    campaign_link_field: 'Campaign Link',
    campaign_link_placeholder: 'Campaign Link',
    go_to_galaxy_description:
      'Go to <a>Galax</a> to create a marketing campaign and get the campaign link.',
    go_to_quest3_description:
      'Go to <a>Quest3</a> to create a marketing campaign and get the campaign link.',
    credential_id: 'Credential ID',
    credential_id_placeholder: 'Credential ID',
    access_token: 'Access Token',
    access_token_placeholder: 'Access Token',
    enable: 'Enable',
    disable: 'Disable',
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
    update_failed: 'Setup failed, reason: {{message}}',
    update_succeed: 'Setup succeed!',
    // language=html
    help: `<h3>What is Subscribe To Earn?</h3>
           <ul>
             <li>
               Subscribe to earn can help you create an automated campaign to motivate users to subscribe to your project. 
             </li>
             <li>
               <p>Only a few simple steps are needed:</p>
               <ol>
                 <li>Create your rewards on a supported platform (currently only Project Galaxy OAT & NFT are supported);</li>
                 <li>Follow the guide to complete the configuration below;</li>
                 <li>Get the code to integrate into your website or product.</li>
               </ol>
             </li>
           </ul>
           <h3>How to get the Credential ID?</h3>
           <ul>
             <li>
               As a Galxe resident project party, you can obtain your Credential ID by following the path: [Click on Avatar] > [Crurated Credentials] > [Create] > [Select Type: EVM Address or Snapshot] > [Fill in the necessary information and create Credential] > [Create]
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
    enable_confirm: {
      title: 'Please confirm this operation!',
      description:
        '<p>Please evaluate whether your OAT/NFT issuance is in line with your expectation before enabling it, to avoid users not being able to collect their rewards due to insufficient issuance.</p><br/><p>Make sure your Project Galaxy campaign is active and started before enabling it.</p>',
      confirm: 'Confirm',
    },
    disable_confirm: {
      title: 'Please confirm this operation!',
      description:
        'Please make sure you have adjusted the "subscribe to earn" dialog on your website or product integration before deactivating "subscribe to earn" to avoid situations where users cannot receive rewards after subscribing.',
      confirm: 'Confirm',
    },
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
