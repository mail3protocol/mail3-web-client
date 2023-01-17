export const isWechat = () =>
  navigator.userAgent.toLowerCase().includes('micromessenger')

export const isImToken = () =>
  navigator.userAgent.toLowerCase().includes('imtoken')

export const isCoinbaseWallet = () => {
  if (typeof window === 'undefined') return false
  const w = window as any
  const ethereum = w.ethereum as
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

export const isMobile = () =>
  /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
