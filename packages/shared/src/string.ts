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
  address.length >= 4 && address.slice(-4) === '.eth' && !address.includes(' ')

export const supportedUdDomain = new Set([
  'crypto',
  'nft',
  'wallet',
  'blockchain',
  'x',
  'bitcoin',
  'dao',
  '888',
  'zil',
])

export const isUdDomain = (address: string) => {
  const [name, domain] = address.split('.')
  if (name && domain) {
    return supportedUdDomain.has(domain) && name.length >= 1
  }
  return false
}

export const isSupportShortBitAddr = (address: string) => {
  const excludedDomains = ['eth', ...Array.from(supportedUdDomain)]
  const topLevelDomain = 'bit'
  const label = '[a-zA-Z0-9]+'
  const subDomain = `${label}\\.${label}`
  const excludedDomainString = excludedDomains.join('|')
  const regexString = `^(?!.*\\.(${excludedDomainString})\\.${topLevelDomain}$|${label}\\.${excludedDomainString}\\.${topLevelDomain}$)${subDomain}\\.${topLevelDomain}$`
  const regex = new RegExp(regexString)
  return regex.test(address)
}

export const isSubBitDomain = (address: string) => {
  const topLevelDomain = 'bit'
  const label = '[a-zA-Z0-9]+'
  const subDomain = `${label}\\.${label}`

  const regexString = `^${subDomain}\\.${topLevelDomain}$`
  const regex = new RegExp(regexString)
  return regex.test(address)
}

export const isBitDomain = (address: string) =>
  /\.bit$/.test(address) && !address.includes(' ')

export const isPrimitiveEthAddress = (address: string) =>
  /^(0x){1}[0-9a-fA-F]{40}$/i.test(address)

export const isEthAddress = (address: string) =>
  isPrimitiveEthAddress(address) ||
  isEnsDomain(address) ||
  isBitDomain(address) ||
  isUdDomain(address)

export const isZilpayAddress = (address: string) =>
  address != null && address.startsWith('zil') && address.length === 42

export const isSupportedAddress = (address: string) =>
  isZilpayAddress(address) || isEthAddress(address) || address.includes('.')

export const getSupportedAddress = (address: string) => {
  if (verifyEmail(address)) {
    const [addr, suffix] = address.split('@')
    if (['mail3.me', 'imibao.net'].includes(suffix)) {
      return addr
    }
    return ''
  }
  return address
}

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

export const mailAddressToAddress = (mailAddress: string) => {
  if (verifyEmail(mailAddress)) {
    const [address] = mailAddress.split('@')
    return address
  }

  return mailAddress
}

export const truncateAddress = (
  address: string,
  pad?: string,
  takeLength = 6,
  tailLength = 4
) => {
  if (isPrimitiveEthAddress(address) || isZilpayAddress(address))
    return truncateMiddle(address, takeLength, tailLength, pad)

  return address
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

export const isHttpUriReg = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?/

export async function digestMessage(
  message: string,
  options?: {
    algorithm: 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512'
  }
) {
  const algorithm = options?.algorithm || 'SHA-256'
  // eslint-disable-next-line compat/compat
  const msgUint8 = new TextEncoder().encode(message)
  const hashBuffer = await crypto.subtle.digest(algorithm, msgUint8)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

export function removeMailSuffix(emailAddress: string) {
  if (!verifyEmail(emailAddress)) return emailAddress
  let i = emailAddress.length - 1
  for (; i >= 0; i--) {
    if (emailAddress[i] === '@') {
      break
    }
  }
  return emailAddress.substring(0, i)
}

export function isVerifyOverflow({
  str,
  fontSize,
  width,
  height,
  lineHeight,
}: {
  str: string
  fontSize: string
  width: string
  height: string
  lineHeight: string
}) {
  const div = document.createElement('div')
  div.classList.add('family-to-read')
  div.style.position = 'absolute'
  div.style.top = '-9999'
  div.style.width = width
  div.style.fontSize = fontSize
  div.style.lineHeight = lineHeight
  div.style.whiteSpace = 'pre-line'
  div.innerHTML = str
  document.body.appendChild(div)
  const isOverflow = div.offsetHeight > parseInt(height, 10)
  document.body.removeChild(div)
  return isOverflow
}

export const isInvalidNickname = (nickname: string): boolean =>
  /[,!;/><:\\]/.test(nickname)
