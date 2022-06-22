import React, { useMemo } from 'react'
import { Box } from '@chakra-ui/react'
import parse, {
  DOMNode,
  Element,
  HTMLReactParserOptions,
} from 'html-react-parser'
import DOMPurify from 'dompurify'
import { AddressResponse, AttachmentItemResponse } from '../../api'
import { AttachmentImage } from './Attachment/image'
import { OFFICE_ADDRESS_LIST } from '../../constants'

interface htmlParserProps {
  html: string
  messageId: string
  attachments: AttachmentItemResponse[] | null
  from: AddressResponse
}

export const RenderHTML: React.FC<htmlParserProps> = ({
  html,
  attachments,
  messageId,
  from,
}) => {
  const replace = (dom: DOMNode) => {
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
      return dom
    }

    return dom
  }

  const options: HTMLReactParserOptions = {
    replace,
  }

  const addTags = useMemo(() => {
    const isOfficeMail = OFFICE_ADDRESS_LIST.some(
      (address) => from.address === address
    )
    if (isOfficeMail) return ['iframe']
    return []
  }, [from.address])

  const cleanHtml = useMemo(() => {
    const content = DOMPurify.sanitize(html, { ADD_TAGS: addTags })
    // because react not support style !important.
    return content.replace(/ !important;/g, ';')
  }, [html])

  return <Box>{parse(cleanHtml, options)}</Box>
}
