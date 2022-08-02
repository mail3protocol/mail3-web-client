import { Skeleton } from '@chakra-ui/react'
import { useQuery } from 'react-query'
import React from 'react'

import { useAPI } from '../../../hooks/useAPI'

type AttachmentData = {
  id: string
  contentType: string
  filename: string
  encodedSize: number
  contentId: string
  inline: boolean
}

interface AttachmentImageProps {
  messageId: string
  attachments: AttachmentData[]
  attribs: Record<string, string>
}

const findId = (arr: AttachmentData[], cid: string) => {
  for (let i = 0; i < arr.length; i++) {
    const e = arr[i]
    if (
      e.inline &&
      e.contentId.trim() === `\u003c${cid.replace('cid:', '')}\u003e`
    ) {
      return arr[i].id
    }
  }
  return ''
}

export const AttachmentImage: React.FC<AttachmentImageProps> = ({
  attachments,
  messageId,
  attribs,
}) => {
  const api = useAPI()
  const { src: cid, width, height, style = '', alt } = attribs

  const {
    isLoading,
    data: src,
    isError,
  } = useQuery(
    ['image', cid],
    async () => {
      const res = await api.downloadAttachment(
        messageId,
        findId(attachments, cid)
      )
      const url = window.URL.createObjectURL(new Blob([res.data]))
      return url
    },
    {
      refetchIntervalInBackground: false,
      refetchOnMount: true,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  )
  if (isLoading || !src)
    return <Skeleton width="200px" height="200px" isLoaded={false} />

  if (isError)
    return (
      <div
        style={{
          width: '200px',
          height: '100px',
          border: '1px solid #ccc',
          padding: '10px',
          textAlign: 'left',
        }}
      >
        The image fails to load.
      </div>
    )

  return (
    // no support chakra style in iframe
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={(dom) => {
        if (!dom) return

        dom.setAttribute('data-cid', cid)
        if (style) dom.setAttribute('style', style)
        if (width) dom.setAttribute('width', width)
        if (height) dom.setAttribute('height', height)
      }}
      src={src}
      alt={alt}
    />
  )
}
