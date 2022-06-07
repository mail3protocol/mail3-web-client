import React from 'react'
import { Box } from '@chakra-ui/react'
import parse, {
  DOMNode,
  Element,
  HTMLReactParserOptions,
} from 'html-react-parser'
import { AttachmentItemResponse } from '../../api'
import { AttachmentImage } from './Attachment/image'

interface htmlParserProps {
  html: string
  messageId: string
  attachments: AttachmentItemResponse[] | null
}

export const RenderHTML: React.FC<htmlParserProps> = ({
  html,
  attachments,
  messageId,
}) => {
  const replace = (dom: DOMNode) => {
    if (dom instanceof Element) {
      if (dom.attribs?.src?.startsWith('cid:') && attachments) {
        return (
          <AttachmentImage
            attachments={attachments}
            cid={dom.attribs.src}
            messageId={messageId}
          />
        )
      }
      return dom
    }

    return dom
  }

  const options: HTMLReactParserOptions = {
    replace,
  }

  return <Box>{parse(html, options)}</Box>
}
