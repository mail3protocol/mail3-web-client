export default {
  common: {
    no_mail3: 'No Mail3? ',
    register: 'Claim it now! ',
    connect_wallet: 'Connect Wallet',
    status_field: 'Status: ',
    status_value: {
      disabled: 'Disabled',
      enabled: 'Enabled',
      loading: 'Loading',
    },
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
    copy_successfully: 'Copy successfully',
    copy_message_link: 'Copy post link',
    send_time_limit:
      'Only 10 posts can be made in 24 hours, please come back and try again later.',
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
      home: 'Home',
      published: 'Published',
      editors: 'Editors',
      nft_reward: 'NFT Reward',
      premium: 'Premium',
      chatgpt: 'ChatGPT Bot',
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
      subscription: 'Subscription page',
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
      description: `Please click the "Apply" button to submit your application. It may take some time for your application to receive a response.`,
      no_white_list_description:
        'If you would like to apply for access to "mail<sup>3</sup> Community". <br/><br/>Please visit mail<sup>3</sup> official website to claim your Mail3 first.',
      register_mail_default_subject: '[Apply for Mail3 Community whitelist]',
      continue: 'Continue',
      apply: 'Apply',
    },
  },
  new_message: {
    subject: 'Subject',
    subject_limit: '{{count}} / {{limit}}',
    editor_placeholder: 'Start writing here...',
    preview: 'Preview',
    send: 'Publish',
    sending: 'Sending...',
    edit: 'Edit',
    send_succeed: 'Message Sent',
    send_failed: 'Send failed, reason: {{message}}',
    mail_image_limit:
      'The total image size of this message cannot exceed {{size}}',
    send_confirm: 'Please confirm you want to send this message',
    send_description: 'Do you want to send this message to subscriber?',
    send_premium_message_confirm_title: '👌OK!',
    send_premium_message_confirm_text:
      'Do you want to publish this Premium Content to subscriber?',
    confirm: 'Confirm',
    unsubscribe: 'Unsubscribe',
    successfully_sent: {
      title: 'Successfully sent',
      description: 'About to exit this page',
      confirm: 'Confirm',
    },
    ok: 'OK',
    copy: 'Copy',
    copy_url: 'Copy URL',
    share_message: 'Share your message',
    abstract_holder:
      'The abstract will be displayed on your subscribe page to help subscribers quickly understand the content, if not filled in, it will not be displayed.',
    premium_switch_help_text:
      'You are editing Premium Content, only your Premium Members can access.',
    general_help_text:
      'You are editing General Content, anyone can view for free.',
    premium: 'Premium',
    general: 'General',
    did_not_enable_premium: "You don't have Premium enabled",
    what_is_the_premium: `<h4>What is Premium？</h4>
        <p>You can get yourself creative revenue by enabling the Premium. You can find more details through [Premium] or visit <a>Mail3 Discord server</a>, turn to <i>premium-support</i> channel for more help if you have any questions.</p>`,
  },
  dashboard: {
    message: 'Posts',
    subscribers: 'Subscribers',
    new_subscribers: 'New Subscribers',
    statistics_time: 'Statistics time: Yesterday 00:00 - 24:00',
    send_message: 'New Post',
    send_records: 'Published',
    send_records_tooltip: 'Show 10 recent posts',
    view_all_send_records: 'All published posts',
    download_failed: 'Download failed, reason: {{message}}',
    download_no_data: 'No data, unable to download.',
    switch_from_mirror: 'Switch from Mirror',
    mirror: {
      sub_title:
        'Please confirm that you want to import posts from mirror.xyz.',
      desc: 'After importing, the posts will appear in the published and on your subscription page, and your subscribers will not receive push notifications.',
      import: 'Import',
      importing: 'Importing...',
      toast: 'Please refresh the page later to check.',
      not_allow:
        'Only the administrator account has permission to perform this operation.',
      not_found: 'Mirror account not found.',
    },
  },
  earn_nft: {
    title: 'NFT Reward',
    to_earn: 'To Earn',
    nft: 'NFT',
    air: 'No Rewards',
    air_p: `Choosing “No Rewards” means you don't have to offer any rewards to
    subscribers.`,
    distribution_platform: 'Distribution Platform',
    platforms: {
      galaxy: 'Galxe',
      quest3: 'QuestN',
    },
    campaign_link_field: 'Campaign Link',
    campaign_link_placeholder: 'Campaign Link',
    quest_link_field: 'Quest Link',
    quest_link_placeholder: 'Quest Link',
    go_to_galaxy_description:
      'Go to <a>Galxe</a> to create a marketing campaign and get the campaign link.',
    go_to_quest3_description:
      'Go to <a>QuestN</a> to create a quest and get the quest link.',
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
      customize_the_button: 'Code',
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
    help_galxe: `<h3>What is NFT Reward?</h3>
           <ul>
             <li>
              <strong>NFT Reward</strong> can help you create an automated campaign to motivate users to subscribe to your project.
             </li>
             <li>
               <p>Only a few simple steps are needed:</p>
               <ol>
                 <li>Create a Campaign/Quest on the supported platform;</li>
                 <li>Follow the guide to complete the configuration below;</li>
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
    help_quest3: `<h3>What is NFT Reward?</h3>
           <ul>
             <li>
              <strong>NFT Reward</strong> can help you create an automated campaign to motivate users to subscribe to your project.
             </li>
             <li>
               <p>Only a few simple steps are needed:</p>
               <ol>
                 <li>Create your rewards on a supported platform (Galxe or QuestN);</li>
                 <li>Follow the guide to complete the configuration below;</li>
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
        'Please make sure you have adjusted the "NFT Reward" dialog on your website or product integration before deactivating "NFT Reward" to avoid situations where users cannot receive rewards after subscription.',
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
    name_field: 'Publication name',
    name_placeholder: 'Publication name',
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
        'Image format only: BMP, JPEG, JPG, GIF, PNG <br> Should not exceed <span>5MB</span>',
      appear:
        'This image will appear across the top of your subscription page. ',
    },
    cluster3_Link: 'Cluster3 Community Page Link',
    appear:
      'This will appear on the <span>Items</span> section of your Subscription Page.',
    appear_text: `
    Please go to <a>Cluster3</a> search your project name, enter your project profile page,<br> <b>copy the Url (Like: https://rank.cluster3.net/community/1373)</b> of the page and fill it in here, we will automatically show you the poap you have released, please make sure the url is yours.`,
    display_Mail_Me_Button: 'Display Mail Me Button on the Subscription Page',
    save: 'Save',
    description: 'Description',
    description_placeholder:
      'Hey, welcome to my Web3 Subscription and check out my creative content.',
    // language=html
    help_qr_code: `<h3>Profile QR Code</h3>
        <p>Download profile page card or QR code for promotion and sharing.</p>
 `,
    pixels: 'Images must be at least <span>2440X400</span> pixels',
    exceed: 'Images should not exceed <span>5M</span>',
    avatar_format:
      'Image format only: BMP, JPEG, JPG, GIF, PNG, Should not exceed 2MB.',
    avatar_exceed: 'Images should not exceed <span>2M</span>',
  },
  ipfs: {
    ipfs_link: 'IPFS LINK',
    eth_address: 'SENDER ETHEREUM ADDRESS',
    zil_address: 'SENDER ZILLIQA ADDRESS',
    address: 'SENDER ADDRESS',
    content_digest: 'CONTENT DIGEST',
    pending: 'PENDING',
  },
  ipfs_modal: {
    title: 'Enable IPFS Storage',
    content:
      'Generate an encryption key to encrypt your content, \n and store the encrypted content on IPFS automatically',
    generate_key: 'Generate key',
    signing_modal: {
      title: 'Please check your \nwallet Content',
      content:
        'You need to approve the message signing request on your wallet software including Walletconnect in your mobile devices.',
    },
    need_to_open_wallet:
      'Need to open wallet. If already connected, please try again. ',
  },
  send_message: {
    title: 'Published',
    new_message: 'New Post',
    send_rule:
      'Only 10 posts can be published in 24 hours, only the first 3 posts will push desktop notifications to your subscribers.',
    switch_from_mirror: 'Switch from Mirror',
  },
  premium: {
    title: 'Premium',
    // language=html
    help: `<h3>What is <strong>Premium</strong>?</h3>
        <ul>
          <li>Enabling Premium can help you generate creative revenue.</li>
          <li>By enabling Premium, you can publish content that is only accessible to Premium members.</li>
          <li>Any visitor interested in your Premium content will need to purchase and maintain a sub-domain to gain access to it.</li>
        </ul>
        <h3>How does <strong>Premium</strong> work?</h3>
        <ul>
          <li>To open your sub-domain sale business in <daodid>DAODID</daodid>, you must first hold your own <bit>.bit</bit> domain name.</li>
          <li>Normally, the content you publish is public and free. However, with Premium enabled, you can choose to publish premium content according to your needs.</li>
          <li>Your visitors can become Premium members by purchasing and holding your sub-domain. Premium members have the right to access all of your Premium content.</li>
        </ul>
        <h3>How can I receive my <strong>earnings</strong>?</h3>
        <ul>
            <li>Mail3 or Subscribe (Mail3) will not participate in the share of proceeds.</li>
            <li>Premium's sub-domain sales business is supported by <daodid>DAODID</daodid>. Information regarding your sales revenue, how to withdraw it, and specific rules can be found on the <daodid>DAODID</daodid> website.</li>
        </ul>
    `,
    contact_us:
      'If you have any questions, please read the help file on the right or visit <contact> Mail3 Discord server </contact>, turn to <i>premium-support</i> channel for more help',
    domain_field: 'Your <bit>.bit</bit> domain',
    confirm: 'Confirm',
    status: 'Status',
    set_up_sales_strategy: 'Set up your sub-domain sales strategy',
    set_up_sales_strategy_tips:
      'This service is provided by DaoDID.\nYou need to navigate to DaoDID in order to adjust the settings.',
    waiting_enable_subdomain:
      'Please Verify that the domain name is open for sub-domain services',
    verifying_enable_subdomain:
      'Verifying that the domain name is available for sub-domain services...',
    failed_enable_subdomain:
      'This domain name does not have sub-domain service. Please either change the domain name or confirm that sub-domain service is not needed.',
    enabled_subdomain:
      'This domain name is now available for sub-domain services.',
    waiting_enable_subdomain_price:
      'Please verify that the prices for sub-domains have been set.',
    verifying_enable_subdomain_price:
      'Verifying that sub-domain prices are set…',
    failed_enable_subdomain_price:
      'The sub-domain price has not been set yet. Please click the button below to go to Settings and try again. <retry> Click here </retry> to retry.',
    enabled_subdomain_price:
      'Sub-domain price setting has already been completed.',
    enable: 'Enable',
    disable: 'Disable',
    is_not_dot_bit_address: 'This is not a .bit domain',
    is_not_owner: 'Sorry, you are not the owner of this domain',
    enable_confirm_dialog: {
      title:
        'Please carefully review the following \ninformation before enabling.',
      description: `<ol>
    <li>After enabling the configuration, you will not be able to modify it. Therefore, ensure that the information you configure is accurate.
<br/></li>
    <li>The income from the sale of sub-domains belongs to the creator. Subscriptions do not participate in any form of revenue sharing. If you have any questions, you can view this <detail>detailed document.</detail></li>
  </ol>`,
    },
    disable_confirm_dialog: {
      title: 'Please confirm this operation!',
      description: `<p>Disabling the service will have an impact:</p>
<ol>
  <li>The sale of sub-domains on Mail3 will be temporarily suspended.</li>
  <li>You will be unable to publish new premium content.</li>
  <li>Premium members will still be able to view published premium content.</li>
</ol>`,
    },
  },
  co_authors: {
    confirm: 'Confirm',
    title: 'Editors',
    tabs: {
      management: 'Editors Management',
    },
    management_text:
      'Inviting authorized editors, they can: connect to this backend, set up Subscription and publish posts.',
    wallet_address: 'Wallet Address',
    state: 'State',
    operate: 'Operate',
    empty: 'No editor have been invited yet',
    cancel: 'Cancel',
    bind: 'Invite',
    unbind: 'Remove',
    bound: 'Bound',
    bind_title: 'Invite editors',
    bind_limit: 'You can invite up to 3 editors',
    bind_placeholder: 'Please enter wallet address',
    bind_bound:
      'This wallet address has been registered as an editor, please choose another address',
    bind_not_legitimate: 'Please check the wallet address',
    bind_successfully: 'Invite successfully',
    help_text: `<h3>What is Editors?</h3>
    <p>In order to make it more convenient for more people to manage subscription accounts, each subscription account can be added by the administrator to invite 3 wallet addresses as editors, and the editors can directly connect to the Subscription Backend and publish posts.</p>
    `,
    unbind_limit:
      'You have already invited 3 editors, if you want to continue to add, please remove the old editor first.',
    unbind_input_title: 'Remove this editor',
    unbind_input_text:
      'You are about to remove the above wallet address, after removing this address will not be able to connect to this backend for any operation.',
    unbind_successfully: 'Remove successfully',
  },
  chatgpt: {
    title: 'ChatGPT Bot',
    tabs: {
      translation: 'AI Translation',
    },
    translation: {
      reach_text:
        'Once your subscribers reach a certain number, we will unlock more language translation features for you. Your posts will be automatically translated into more languages for readers. Build your borderless community ；).',
      'english_unlocked ': 'English unlocked ',
      unlock: 'languages unlocked',
      subscribers: 'Subscribers',
      primary: 'Your primary writing language',
      primary_text:
        'Please let us know your primary language so we can identify readers and provide them with the original language version if needed.',
      'more-language': 'Add more language versions for your posts',
      provided: 'Provided by the ChatGPT API',
      submit: 'Configure',
      helper_text: `<h3>What is <strong>AI Translation</strong>?</h3>
      <ul>
        <li>AI Translation is an efficient content translation service provided for creators. By utilizing the ChatGPT API, it enables multi-language translation of content and provides translation results that are close to professional translation standards.</li>
        <li>With this service enabled, your readers will be able to easily read your posts without the need for translation tools.</li>
        <li>Using this service can effectively expand your user base and establish a borderless community.</li>
      </ul>
      <h3>How does <strong>AI Translation</strong> work?</h3>
      <ul>
        <li>This service is completely free. We provide English translation by default. If you need more languages, simply increase the number of subscribers to unlock more configurable languages.</li>
      </ul>
  `,
    },
  },
}
