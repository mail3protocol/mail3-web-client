const w = window as any

export const isWechat = () =>
  navigator.userAgent.toLowerCase().includes('micromessenger')

export const isImToken = () =>
  navigator.userAgent.toLowerCase().includes('imtoken')

export const isCoinbaseWallet = () => {
  const ethereum = w.ethereum as
    | {
        isCoinbaseWallet?: boolean
        isCoinbaseBrowser?: boolean
      }
    | undefined
  return ethereum?.isCoinbaseWallet || ethereum?.isCoinbaseBrowser
}

export const isTrust = () => !!w?.ethereum?.isTrust

export const IS_MOBILE = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
