import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Box } from '@chakra-ui/react'
import parse, { DOMNode, Element, Text } from 'html-react-parser'
import DOMPurify from 'dompurify'
import ReactShadowRoot from 'react-shadow-root'
import { createPortal } from 'react-dom'
import { AddressResponse, AttachmentItemResponse } from '../../api'
import { AttachmentImage } from './Attachment/image'
import { OFFICE_ADDRESS_LIST } from '../../constants'

interface htmlParserProps {
  html: string
  messageId: string
  attachments: AttachmentItemResponse[] | null
  from: AddressResponse
}

interface IframeProps extends React.IframeHTMLAttributes<HTMLIFrameElement> {
  getHeight: (h: number) => void
}

export const Iframe: React.FC<IframeProps> = (props) => {
  const { children, getHeight, ...rest } = props
  const [contentRef, setContentRef] = useState<HTMLIFrameElement | null>(null)
  const mountNode = contentRef?.contentWindow?.document?.body

  useEffect(() => {
    const iframeInnerStyle = `
      html {
        overflow: hidden;
      }

      body {
        margin: 0;
        padding: 0;
        position: relative;
      }
    `
    const domStyle = document.createElement('style')
    domStyle.innerHTML = iframeInnerStyle
    contentRef?.contentWindow?.document.head.appendChild(domStyle)

    const h = contentRef?.contentWindow?.document.body.scrollHeight
    getHeight(h ?? 200)
  }, [contentRef])

  return (
    <iframe
      title="Message Content"
      {...rest}
      ref={setContentRef}
      onLoad={() => {
        const h = contentRef?.contentWindow?.document.body.scrollHeight
        getHeight(h ?? 200)
      }}
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
  const reg =
    /(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g
  return text.replace(reg, (url) => `<a href="${url}">${url}</a>`)
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
      if (dom.type === 'text' && dom.parent.name !== 'a') {
        console.log('dom', dom)

        const text = (dom as Text).data
        // console.log(text)
        const doms = urlity(text)
        // dom.setValue('11')
        // console.log('doms', doms)
        // const newText = urlity(text)
        // eslint-disable-next-line react/no-danger
        return <p dangerouslySetInnerHTML={{ __html: doms }} />
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
    DOMPurify.removeHook('beforeSanitizeAttributes')
    DOMPurify.removeHook('afterSanitizeAttributes')
    DOMPurify.addHook('beforeSanitizeAttributes', (node) => {
      console.dir(node)
      // if (node?.nodeName && node.nodeName === 'P') {
      //   node.innerHTML = '111'
      // }

      if (
        node?.nodeName &&
        node.nodeName === '#text' &&
        node?.parentNode?.nodeName !== 'A'
      ) {
        // eslint-disable-next-line no-param-reassign
        node.innerHTML = '123'
        // eslint-disable-next-line no-param-reassign
        // node.textContent = urlity(node.textContent ?? '')
        // node.setAttribute('data-link', 'hasLink')
      }
    })
    DOMPurify.addHook('afterSanitizeAttributes', (node) => {
      // console.log('after', node.nodeName, node)
      // set all elements owning target to target=_blank
      if ('target' in node) {
        node.setAttribute('target', '_blank')
        node.setAttribute('rel', 'noopener noreferrer')
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
