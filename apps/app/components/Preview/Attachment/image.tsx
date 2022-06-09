import { Box, Image, Skeleton } from '@chakra-ui/react'
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
  cid: string
}

const findId = (arr: AttachmentData[], cid: string) => {
  //   contentId: "<signature>"
  for (let i = 0; i < arr.length; i++) {
    const e = arr[i]
    if (e.inline && e.contentId === `<${cid.replace('cid:', '')}>`) {
      return arr[i].id
    }
  }
  return ''
}

export const AttachmentImage: React.FC<AttachmentImageProps> = ({
  attachments,
  messageId,
  cid,
}) => {
  const api = useAPI()

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

  if (isLoading)
    return <Skeleton width="200px" height="200px" isLoaded={false} />

  if (isError)
    return (
      <Box w="200px" h="100px" border="1px solid #ccc" p="10px">
        The image fails to load.
      </Box>
    )

  return (
    <Box>
      <Image src={src} />
    </Box>
  )
}
