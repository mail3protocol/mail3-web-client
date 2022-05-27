import { Box, SimpleGrid, Text } from '@chakra-ui/react'
import React, { useCallback } from 'react'
import Image from 'next/image'
import prettyBytes from 'pretty-bytes'
import { useDialog } from 'hooks'
import { useAPI } from '../../../hooks/useAPI'
import SvgTest from '../../../assets/loading.gif'

type AttachmentData = {
  id: string
  contentType: string
  filename: string
  encodedSize: number
  contentId: string
}

interface AttachmentProps {
  messageId: string
  data: AttachmentData[]
}

export const Attachment: React.FC<AttachmentProps> = ({ data, messageId }) => {
  const api = useAPI()
  const dialog = useDialog()

  const onDownload = useCallback(
    async (id, filename) => {
      try {
        const res = await api.downloadAttachment(messageId, id)
        const url = window.URL.createObjectURL(new Blob([res.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', filename)
        document.body.appendChild(link)
        link.click()
      } catch (error) {
        dialog({
          type: 'warning',
          title: 'error',
        })
      }
    },
    [api, messageId]
  )

  return (
    <Box marginTop="50px">
      <SimpleGrid minChildWidth="100px" spacing="20px">
        {data.map((e) => {
          const { id, filename, encodedSize } = e
          const size = prettyBytes(encodedSize)
          return (
            <Box
              textAlign="center"
              key={id}
              cursor="pointer"
              onClick={() => {
                onDownload(id, filename)
              }}
            >
              <Box w="100%">
                <Image src={SvgTest} />
              </Box>
              <Text
                color="#000"
                fontSize="16px"
                noOfLines={1}
                wordBreak="break-all"
              >
                {filename}
              </Text>
              <Box color="#888" fontSize="16px">
                {size}
              </Box>
            </Box>
          )
        })}
      </SimpleGrid>
    </Box>
  )
}
