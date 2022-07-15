import html2canvas from 'html2canvas'
import { SubmitMessage } from 'models/src/submitMessage'
import { generateAttachmentContentId } from './string'

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
  div.innerHTML = html
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
  div.innerHTML = html
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
