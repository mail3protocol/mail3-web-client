export const IS_TRUST = () => {
  const w = window as any
  return !!w?.ethereum?.isTrust
}

export const IS_CHROME = () => {
  const w = window as any
  return navigator.userAgent.toLowerCase().includes('chrome') || !!w?.chrome
}

export const IS_FIREFOX = () =>
  navigator.userAgent.toLowerCase().includes('firefox')

export const IS_EDGE = () => navigator.userAgent.toLowerCase().includes('edg')

export const IS_WIN = () => /windows|win32/i.test(navigator.userAgent)

export const IS_IPAD = () => navigator.userAgent.toLowerCase().includes('ipad')

export const IS_IPHONE = () =>
  navigator.userAgent.toLowerCase().includes('iphone') &&
  !navigator.vendor.includes('Google')

export const IS_MOBILE = () =>
  /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

export const IS_IOS = () => IS_IPAD() || IS_IPHONE()
