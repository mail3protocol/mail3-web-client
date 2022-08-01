export const isWechat = () =>
  navigator.userAgent.toLowerCase().includes('micromessenger')

export const isImToken = () =>
  navigator.userAgent.toLowerCase().includes('imtoken')

const w = window as any
export const isTrust = () => !!w?.ethereum?.isTrust
