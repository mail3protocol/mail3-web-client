import { Box, Center, Image, Skeleton } from '@chakra-ui/react'
import { useQuery } from 'react-query'
import React, { useState } from 'react'
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

  const [imgSrc, setImgSrc] = useState('')

  const { isLoading } = useQuery(
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
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      onSuccess(d) {
        setImgSrc(d)
      },
      onError() {
        setImgSrc('')
      },
    }
  )

  return (
    <Box>
      {isLoading ? (
        <Skeleton width="200px" height="200px" isLoaded={false} />
      ) : (
        <Center>
          <Image src={imgSrc} />
        </Center>
      )}
    </Box>
  )
}
