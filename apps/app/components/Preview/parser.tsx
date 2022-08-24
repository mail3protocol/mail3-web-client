import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Box } from '@chakra-ui/react'
import parse, { DOMNode, Element, Text } from 'html-react-parser'
import DOMPurify from 'dompurify'
import ReactShadowRoot from 'react-shadow-root'
import { createPortal } from 'react-dom'
import { AddressResponse, AttachmentItemResponse } from '../../api'
import { AttachmentImage } from './Attachment/image'
import { OFFICE_ADDRESS_LIST, IMAGE_PROXY_URL } from '../../constants'
import DefaultFontStyle from '../../styles/font.css'

interface htmlParserProps {
  html: string
  messageId: string
  attachments: AttachmentItemResponse[] | null
  from: AddressResponse
}

interface IframeProps extends React.IframeHTMLAttributes<HTMLIFrameElement> {
  getHeight: (h: number) => void
}

const IFRAME_INNER_STYLE = `
html {
  overflow: hidden;
}

body {
  margin: 0;
  padding: 0;
  position: relative;
  word-break: break-word;
}

${DefaultFontStyle}
`

const DEFAULT_HEIGHT = 200

export const Iframe: React.FC<IframeProps> = (props) => {
  const { children, getHeight, ...rest } = props
  const [contentRef, setContentRef] = useState<HTMLIFrameElement | null>(null)
  const mountNode = contentRef?.contentWindow?.document?.body

  function getHeightByContentRef() {
    const h = contentRef?.contentWindow?.document.body.scrollHeight
    getHeight(h ?? DEFAULT_HEIGHT)
  }

  useEffect(() => {
    const domStyle = document.createElement('style')
    domStyle.textContent = IFRAME_INNER_STYLE
    contentRef?.contentWindow?.document.head.appendChild(domStyle)

    getHeightByContentRef()
  }, [contentRef])

  return (
    <iframe
      title="Message Content"
      {...rest}
      ref={setContentRef}
      onLoad={getHeightByContentRef}
    >
      {mountNode && createPortal(children, mountNode)}
    </iframe>
  )
}

const shadowRootStyle = `
  :host {
    display: block;
  }

  main {
    display: block;
    overflow: hidden;
    min-height: 200px;
  }

  iframe {
    border: none;
    width: 100%;
    height: 0;
    margin: 0;
  }
`
export const UnofficialMailBody: React.FC = ({ children }) => {
  const [height, setHeight] = useState<number>(0)

  return (
    <ReactShadowRoot>
      <style>{shadowRootStyle}</style>
      <main style={{ height: `${height}px` }}>
        <Iframe
          getHeight={(h: number) => {
            setHeight(h)
          }}
          src="about:blank"
          style={{ height: '100%' }}
        >
          {children}
        </Iframe>
      </main>
    </ReactShadowRoot>
  )
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

export const RenderHTML: React.FC<htmlParserProps> = ({
  html,
  attachments,
  messageId,
  from,
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
        if (dom.attribs?.src?.startsWith('cid:') && attachments) {
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
    (address) => from.address === address
  )

  const addTags = useMemo(() => {
    if (isOfficeMail) return ['iframe']
    return []
  }, [from.address])

  const content = useMemo(() => {
    DOMPurify.removeHook('afterSanitizeAttributes')
    DOMPurify.addHook('afterSanitizeAttributes', (node) => {
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
      {isOfficeMail ? (
        <div>{content}</div>
      ) : (
        <UnofficialMailBody>{content}</UnofficialMailBody>
      )}
    </Box>
  )
}
