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
  /[0-9a-fA-F]+.eth$/.test(address)

export const isPrimitiveEthAddress = (address: string) =>
  /^(0x){1}[0-9a-fA-F]{40}$/i.test(address)

export const isEthAddress = (address: string) =>
  isPrimitiveEthAddress(address) || isEnsDomain(address)

export const isZilpayAddress = (address: string) => address.startsWith('zil')

export const truncateMailAddress = (
  mailAddress: string,
  takeLength = 6,
  tailLength = 4
) => {
  if (verifyEmail(mailAddress)) {
    const splitMailAddress = mailAddress.split('@')
    const address = splitMailAddress[0]
    const suffix = splitMailAddress[1]
    if (isPrimitiveEthAddress(address) || isZilpayAddress(address))
      return `${truncateMiddle(address, takeLength, tailLength)}@${suffix}`
  }

  return mailAddress
}
