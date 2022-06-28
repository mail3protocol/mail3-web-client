function isInstalled(): boolean {
  const { zilpay } = window as any
  return typeof zilpay === 'undefined'
}

function isConnected(): boolean {
  const zilpay = (window as any).zilPay
  return zilpay.wallet.isConnect
}

function isUnlocked(): boolean {
  const zilpay = (window as any).zilPay
  return zilpay.wallet.isEnable
}

function getObservableAccount(): any {
  const zilpay = (window as any).zilPay
  const accountStreamChanged = zilpay.wallet.observableAccount()
  return accountStreamChanged
}

function getObservableNetwork(): any {
  const zilpay = (window as any).zilPay
  const networkStreamChanged = zilpay.wallet.observableNetwork()
  return networkStreamChanged
}

function getDefaultWallet(): any {
  const zilpay = (window as any).zilPay
  return zilpay.wallet.defaultAccount
}

function getBech32Address(): string {
  const zilpay = (window as any).zilPay
  return zilpay.wallet.defaultAccount.bech32
}

async function connect() {
  const zilpay = (window as any).zilPay

  if (typeof zilpay === 'undefined') {
    const notInstalled = {
      name: 'ZILPAY_NOT_INSTALLED',
      message: 'Please install the Zilpay wallet extension and try again',
    }
    throw notInstalled
  }

  const connectInfo = await zilpay.wallet.connect()

  if (!connectInfo) {
    const notInstalled = {
      name: 'ZILPAY_NOT_CONNECTED',
      message: 'Could not connect to the Zilpay wallet, please try again.',
    }
    throw notInstalled
  }

  return getBech32Address()
}

export interface ZilpaySignData {
  message: string
  signature: string
  publicKey: string
}

async function signMessage(msg: string) {
  const signData: ZilpaySignData = await (window as any).zilPay.wallet.sign(msg)
  return signData
}

export const zilpay = {
  connect,
  getBech32Address,
  getDefaultWallet,
  getObservableAccount,
  getObservableNetwork,
  isConnected,
  isInstalled,
  isUnlocked,
  signMessage,
}
