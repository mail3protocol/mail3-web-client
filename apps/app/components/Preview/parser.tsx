import React, { useCallback, useEffect, useMemo } from 'react'
import { Box } from '@chakra-ui/react'
import parse, { DOMNode, Element, Text } from 'html-react-parser'
import DOMPurify from 'dompurify'
import ReactShadowRoot from 'react-shadow-root'
import { AddressResponse, AttachmentItemResponse } from '../../api'
import { AttachmentImage } from './Attachment/image'
import { OFFICE_ADDRESS_LIST, IMAGE_PROXY_URL } from '../../constants'

interface htmlParserProps {
  html: string
  messageId?: string
  attachments?: AttachmentItemResponse[] | null
  from?: AddressResponse
  shadowStyle?: string
}

const urlity = (text: string) => {
  const symbolSplit = '{!isLink!}'
  const reg =
    /(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g
  const newText = text.replace(
    reg,
    (url) => `${symbolSplit}${url}${symbolSplit}`
  )
  const textParts = newText.split(symbolSplit)
  return textParts.map((str) => ({
    textType: reg.test(str) ? 'link' : 'text',
    value: str,
  }))
}

const shadowRootStyle = `
  :host {
    display: block;
  }

  main {
    display: block;
    overflow: hidden;
    min-height: 200px;
    position: relative;
  }

  iframe {
    border: none;
  }

  a {
    color: #4d51f3;
  }

  img, video {
    max-width: 100%;
    height: auto;
  }

  img {
    border-style: none;
  }

`

export const RenderHTML: React.FC<htmlParserProps> = ({
  html,
  attachments,
  messageId,
  from,
  shadowStyle,
}) => {
  useEffect(
    () => () => {
      DOMPurify.removeAllHooks()
    },
    []
  )

  const replace = useCallback(
    (dom: DOMNode) => {
      if (dom instanceof Element) {
        if (dom.attribs?.src?.startsWith('cid:') && attachments && messageId) {
          return (
            <AttachmentImage
              attachments={attachments}
              messageId={messageId}
              attribs={dom.attribs}
            />
          )
        }
      }
      if (dom.type === 'text') {
        if ((dom as any)?.parent?.name !== 'a') {
          const textMsg = urlity((dom as Text).data)
          return (
            <>
              {textMsg.map(({ textType, value }, index) => {
                if (textType === 'link') {
                  return (
                    <a
                      // eslint-disable-next-line react/no-array-index-key
                      key={index}
                      href={value}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {value}
                    </a>
                  )
                }
                return value
              })}
            </>
          )
        }
      }

      return dom
    },
    [attachments, messageId]
  )

  const isOfficeMail = OFFICE_ADDRESS_LIST.some(
    (address) => from?.address === address
  )

  const addTags = useMemo(() => {
    if (isOfficeMail) return ['iframe']
    return []
  }, [from?.address])

  const content = useMemo(() => {
    DOMPurify.removeHook('afterSanitizeAttributes')
    DOMPurify.addHook('afterSanitizeAttributes', (node: HTMLElement) => {
      // set all elements owning target to target=_blank
      if ('target' in node) {
        node.setAttribute('target', '_blank')
        node.setAttribute('rel', 'noopener noreferrer')
      }

      if (node.hasAttribute('src') && node.nodeName === 'IMG') {
        const src = node.getAttribute('src')
        if (src?.startsWith('http://')) {
          node.setAttribute('src', `${IMAGE_PROXY_URL}${src}`)
        }
      }

      if (
        !node.hasAttribute('target') &&
        (node.hasAttribute('xlink:href') || node.hasAttribute('href'))
      ) {
        node.setAttribute('xlink:show', 'new')
      }
    })
    const cleanHtml = DOMPurify.sanitize(html, {
      ADD_TAGS: addTags,
      ADD_ATTR: ['target'],
    })
    // TODO can be better
    const removeImportant = cleanHtml.replace(/ !important;/g, ';')

    return parse(removeImportant, { replace })
  }, [html, addTags])

  return (
    <Box>
      <ReactShadowRoot>
        <style>{shadowRootStyle}</style>
        {shadowStyle ? <style>{shadowStyle}</style> : null}
        <main>{content}</main>
      </ReactShadowRoot>
    </Box>
  )
}
