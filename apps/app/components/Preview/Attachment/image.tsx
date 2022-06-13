import { Box, Image, ImageProps, Skeleton } from '@chakra-ui/react'
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
  const { src: cid, width, height, style, alt } = attribs

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
      <Box w="200px" h="100px" border="1px solid #ccc" p="10px">
        The image fails to load.
      </Box>
    )

  const imgProps: ImageProps = {}
  if (width) imgProps.width = width
  if (height) imgProps.height = height

  return <Image src={src} alt={alt} {...imgProps} css={style} />
}
