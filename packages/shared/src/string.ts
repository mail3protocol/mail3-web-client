export function verifyEmail(email: string) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

export function truncateMiddle(
  str = '',
  takeLength = 6,
  tailLength = takeLength,
  pad = '...'
): string {
  if (takeLength + tailLength >= str.length) return str
  return `${str.slice(0, takeLength)}${pad}${str.slice(-tailLength)}`
}

export const isEnsDomain = (address: string) =>
  address.length >= 4 && address.slice(-4) === '.eth'

export const isBitDomain = (address: string) => /\.bit$/.test(address)

export const isPrimitiveEthAddress = (address: string) =>
  /^(0x){1}[0-9a-fA-F]{40}$/i.test(address)

export const isEthAddress = (address: string) =>
  isPrimitiveEthAddress(address) || isEnsDomain(address) || isBitDomain(address)

export const isZilpayAddress = (address: string) =>
  address != null && address.startsWith('zil') && address.length === 42

export const isSupportedAddress = (address: string) =>
  isZilpayAddress(address) || isEthAddress(address)

export const truncateMailAddress = (
  mailAddress: string,
  takeLength = 6,
  tailLength = 4
) => {
  if (verifyEmail(mailAddress)) {
    const [address, suffix] = mailAddress.split('@')
    if (isPrimitiveEthAddress(address) || isZilpayAddress(address))
      return `${truncateMiddle(address, takeLength, tailLength)}@${suffix}`
  }

  return mailAddress
}

export function copyTextFallback(data: string): void {
  const input = document.createElement('input')
  input.readOnly = true
  input.value = data
  input.style.position = 'absolute'
  input.style.width = '100px'
  input.style.left = '-10000px'
  document.body.appendChild(input)
  input.select()
  input.setSelectionRange(0, input.value.length)
  document.execCommand('copy')
  document.body.removeChild(input)
}

export async function copyText(s: string) {
  try {
    // eslint-disable-next-line compat/compat
    await navigator.clipboard.writeText(s)
  } catch (error) {
    copyTextFallback(s)
  }
}
