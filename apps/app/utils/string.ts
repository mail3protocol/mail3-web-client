import { verifyEmail, truncateMiddle } from 'shared'
import { MAIL_SERVER_URL } from '../constants'

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

export function truncateEmailMiddle(str = '', takeLength = 6, tailLength = 4) {
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

export const is0xAddress = (address: string) => address.startsWith('0x')

export const truncateMiddle0xMail = (
  address: string,
  takeLength = 6,
  tailLength = 4
) => {
  if (!verifyEmail(address)) return address
  if (!is0xAddress(address)) return address
  const splitAddress = address.split('@')
  const realAddress = splitAddress[0]
  const suffix = splitAddress[1]
  return `${truncateMiddle(realAddress, takeLength, tailLength)}@${suffix}`
}

export function filterEmails(strings: string[]) {
  return strings.filter((str) => verifyEmail(str))
}

export function getDriftBottleFrom(str: string): string | undefined {
  const removedTagStr = str.replace(/<[^>]*>?/gm, ' ').replace(/(&nbsp;)/g, ' ')
  return removedTagStr
    .match(
      /Drift\sbottle\sfrom(\s*)\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/g
    )?.[0]
    .substring(18)
    .trim()
}

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

export function generateAttachmentContentId(content: string) {
  return digestMessage(content, { algorithm: 'SHA-1' })
}

export const isHttpUriNoBlankSpaceReg =
  /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?/g

export const isHttpUriReg = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?/
