import { Box, Center, SimpleGrid, Spinner, Text } from '@chakra-ui/react'
import React, { useCallback, useState } from 'react'
import prettyBytes from 'pretty-bytes'
import { useDialog } from 'hooks'
import { useAPI } from '../../../hooks/useAPI'
import { FileIcon } from './fileIcon'

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
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({})

  const onDownload = async (id: string, filename: string) => {
    setLoadingMap((m) => ({
      ...m,
      [id]: true,
    }))
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
    setLoadingMap((m) => ({
      ...m,
      [id]: false,
    }))
  }

  return (
    <Box marginTop="50px">
      <SimpleGrid
        spacing="20px"
        gridTemplateColumns="repeat(auto-fill, minmax(100px, 1fr))"
      >
        {data.map((e, index) => {
          const { id, filename, encodedSize, contentType } = e
          const size = prettyBytes(encodedSize)
          return (
            <Box
              maxWidth="150px"
              textAlign="center"
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              cursor="pointer"
              onClick={() => {
                if (loadingMap[id]) return
                onDownload(id, filename)
              }}
            >
              <Box w="100%" position="relative">
                <FileIcon type={contentType} w="100%" h="100%" />
                {loadingMap[id] ? (
                  <Center
                    w="100%"
                    h="100%"
                    position="absolute"
                    top="0"
                    left="0"
                    backgroundColor="rgba(255,255,255,0.5)"
                  >
                    <Spinner />
                  </Center>
                ) : null}
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
