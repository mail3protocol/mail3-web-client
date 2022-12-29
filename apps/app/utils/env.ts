export const isWechat = () =>
  navigator.userAgent.toLowerCase().includes('micromessenger')

export const isImToken = () =>
  navigator.userAgent.toLowerCase().includes('imtoken')

export const isCoinbaseWallet = () => {
  const ethereum = window.ethereum as
    | {
        isCoinbaseWallet?: boolean
        isCoinbaseBrowser?: boolean
      }
    | undefined
  return ethereum?.isCoinbaseWallet || ethereum?.isCoinbaseBrowser
}

export const isTrust = () => {
  const w = window as any
  return !!w?.ethereum?.isTrust
}

export const isChrome = () => {
  const w = window as any
  return navigator.userAgent.toLowerCase().includes('chrome') || !!w?.chrome
}

export const isFirefox = () =>
  navigator.userAgent.toLowerCase().includes('firefox')

export const isEdge = () => navigator.userAgent.toLowerCase().includes('edg')

export const isWindows = () => /windows|win32/i.test(navigator.userAgent)

export const isIpad = () => navigator.userAgent.toLowerCase().includes('ipad')

export const isIphone = () =>
  navigator.userAgent.toLowerCase().includes('iphone') &&
  !navigator.vendor.includes('Google')

export const isMobile = () =>
  /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

export const isIos = () => isIpad() || isIphone()
