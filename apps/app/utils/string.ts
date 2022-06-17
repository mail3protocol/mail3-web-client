import { MAIL_SERVER_URL } from '../constants'

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

export function isEthAddress(s: string) {
  return s.startsWith('0x') && s.length === 42
}

export function truncateEmailMiddle(str = '', takeLength = 6, tailLength = 6) {
  if (!verifyEmail(str)) return str
  let i = str.length - 1
  for (; i >= 0; i--) {
    if (str[i] === '@') {
      break
    }
  }
  return truncateMiddle(str, takeLength, str.length - i + tailLength)
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

export function generateUuid() {
  function S4() {
    return ((1 + Math.random()) * 0x10000 || 0).toString(16).substring(1)
  }
  return `${S4() + S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`
}

export const isMail3Address = (address: string) =>
  [MAIL_SERVER_URL, 'imibao.net'].some((item) =>
    address.toLowerCase().endsWith(item)
  )

export const isENS = (address: string) => address.endsWith('.eth')

export const truncateMiddle0xMail = (
  mailAddress: string,
  takeLength = 6,
  tailLength = 4
) => {
  if (!verifyEmail(mailAddress)) return mailAddress
  const splitMailAddress = mailAddress.split('@')
  const address = splitMailAddress[0]
  const suffix = splitMailAddress[1]
  if (isENS(address)) return mailAddress
  if (!isEthAddress(address)) return mailAddress

  return `${truncateMiddle(address, takeLength, tailLength)}@${suffix}`
}

// const a = '0xClass.eth@mail3.me'
// const b = '0x17efdccfc61a03ae6620f35e502215edde20c13d@mail3.me'
// const c = 'classclassclassclassclassclass.eth@google.com'
// const d = '12345678910@gmail.com'

// console.log(a, truncateMiddle0xMail(a))
// console.log(b, truncateMiddle0xMail(b))
// console.log(c, truncateMiddle0xMail(c))
// console.log(d, truncateMiddle0xMail(d))
