import html2canvas from 'html2canvas'
import { SubmitMessage } from 'models/src/submitMessage'
import DOMPurify from 'dompurify'
import { GetMessage } from 'models'
import { generatePath } from 'react-router-dom'
import { generateAttachmentContentId } from './string'
import { Action } from '../csr-pages/message/edit'
import { RoutePath } from '../route/path'

export async function onRenderElementToImage(element: HTMLDivElement) {
  return html2canvas(element, {
    useCORS: true,
    allowTaint: true,
    height: element.offsetHeight,
    width: element.offsetWidth,
    scale: 2,
    backgroundColor: null,
  }).then((canvas) => canvas.toDataURL())
}

export function replaceHtmlAttachImageSrc(
  html: string,
  attachments: SubmitMessage.Attachment[]
) {
  const div = document.createElement('div')
  div.innerHTML = DOMPurify.sanitize(html)
  const cidToAttachmentMap = attachments.reduce<{
    [key: string]: SubmitMessage.Attachment
  }>(
    (acc, attachment) => ({
      ...acc,
      [(attachment.cid || '').trim() as string]: attachment,
    }),
    {}
  )
  const imageElements: HTMLImageElement[] = Array.from(
    div.querySelectorAll('img')
  )
  imageElements.forEach((imageElement) => {
    const cid = imageElement.getAttribute('src')?.substring(4)
    if (!cid) return
    const attachment = cidToAttachmentMap[`<${cid}>`]
    if (!attachment) return
    imageElement.setAttribute(
      'src',
      `data:${attachment.contentType};base64,${attachment.content}`
    )
  })
  return div.innerHTML
}

export async function outputHtmlWithAttachmentImages(html: string) {
  const div = document.createElement('div')
  div.innerHTML = DOMPurify.sanitize(html)
  const imageElements: HTMLImageElement[] = Array.from(
    div.querySelectorAll('img')
  )
  const attachments: SubmitMessage.Attachment[] = []
  const suffixNameMap: { [key: string]: string } = {
    'image/png': '.png',
    'image/jpeg': '.jpeg',
    'image/gif': '.gif',
    'image/webp': '.webp',
    'image/bmp': '.bmp',
  }
  await Promise.all(
    imageElements.map(async (imageElement) => {
      const src = imageElement.getAttribute('src')
      if (!src) return
      const isBase64 = src.startsWith('data:')
      if (!isBase64) return
      const split = src.split(';base64,')
      const contentType = split[0].substring(5)
      const content = split[1]
      // eslint-disable-next-line no-await-in-loop
      const cid = await generateAttachmentContentId(content)
      attachments.push({
        filename: `${cid}${suffixNameMap[contentType]}`,
        contentType,
        content,
        contentDisposition: 'inline',
        cid,
      })
      imageElement.setAttribute('src', `cid:${cid}`)
    })
  )

  return {
    html: div.innerHTML,
    attachments,
  }
}

export function removeDuplicationAttachments(
  attachments: SubmitMessage.Attachment[]
) {
  const idSet = new Set(attachments.map((a) => a.cid))
  return attachments.filter((attachment) => {
    const has = idSet.has(attachment.cid)
    idSet.delete(attachment.cid)
    return has
  })
}

export const DISABLED_FILENAME_SPECIAL_CHARACTERS = [
  './',
  '<!--',
  '-->',
  '<',
  '>',
  "'",
  '"',
  '&',
  '$',
  '#',
  '{',
  '}',
  '[',
  ']',
  '=',
  ';',
  '?',
  '%20', // space
  '%22', // "
  '%3c', // <
  '%253c', // <
  '%3e', // >
  '%28', // (
  '%29', // )
  '%2528', // (
  '%26', // &
  '%24', // $
  '%3f', // ?
  '%3b', // ;
  '%3d', // =
]

export function hasFilenameSpecialCharacters(filename: string) {
  return DISABLED_FILENAME_SPECIAL_CHARACTERS.some((char) =>
    filename.includes(char)
  )
}

export function generateMessageEditorUrl({
  action,
  messageInfo,
  cc,
  bcc,
  to,
  subject,
}: {
  action?: Action
  messageInfo?: GetMessage.Response | null
  cc?: string[]
  bcc?: string[]
  to?: string[]
  subject?: string
}) {
  const replySubjectPrefix = 'Re: '
  const forwardSubjectPrefix = 'Fwd: '
  const setupSubjectPrefix = (add: string, remove: string) => {
    if (!messageInfo?.subject) return ''
    if (messageInfo.subject.startsWith(add)) {
      return messageInfo.subject
    }
    const handled = messageInfo.subject.startsWith(remove)
      ? messageInfo.subject.substring(remove.length)
      : messageInfo.subject
    return `${add}${handled}`
  }
  const generateQueryParameters = (
    queryObject: Record<string, string | undefined>
  ): string =>
    Object.keys(queryObject)
      .filter((key) => queryObject[key])
      .map((key) => `${key}=${queryObject[key]}`)
      .join('&')

  if (action === 'reply' && messageInfo) {
    const replySubject = setupSubjectPrefix(
      replySubjectPrefix,
      forwardSubjectPrefix
    )
    const queryParameters = generateQueryParameters({
      to: [messageInfo.from.address, ...(to || [])].join(','),
      cc: cc?.join(','),
      bcc: bcc?.join(','),
      subject: subject || replySubject,
      action,
      id: messageInfo.id,
    })
    return generatePath(`${RoutePath.NewMessage}?${queryParameters}`)
  }

  if (action === 'forward' && messageInfo) {
    const forwardSubject = setupSubjectPrefix(
      forwardSubjectPrefix,
      replySubjectPrefix
    )
    const queryParameters = generateQueryParameters({
      to: to?.join(','),
      cc: cc?.join(','),
      bcc: bcc?.join(','),
      subject: subject || forwardSubject,
      action,
      id: messageInfo.id,
    })
    return generatePath(`${RoutePath.NewMessage}?${queryParameters}`)
  }

  const queryParameters = generateQueryParameters({
    to: to?.join(','),
    cc: cc?.join(','),
    bcc: bcc?.join(','),
    subject,
    action,
  })
  return generatePath(`${RoutePath.NewMessage}?${queryParameters}`)
}
