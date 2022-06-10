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
import { MAIL_SERVER_URL } from '../../constants'

interface htmlParserProps {
  html: string
  messageId: string
  attachments: AttachmentItemResponse[] | null
  from: AddressResponse
}

const OFFICE_ADDRESS_LIST = [
  'mail3.eth@imibao.net',
  `no-reply-pls.eth@${MAIL_SERVER_URL}`,
  `mail3.eth@${MAIL_SERVER_URL}`,
]

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

  const cleanHtml = DOMPurify.sanitize(html, { ADD_TAGS: addTags })

  return <Box>{parse(cleanHtml, options)}</Box>
}
