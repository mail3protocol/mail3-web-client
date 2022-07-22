import { Box, Button, Center, Grid, Progress } from '@chakra-ui/react'
import React from 'react'
import { CloseIcon } from '@chakra-ui/icons'
import { SubmitMessage } from 'models/src/submitMessage'
import { FileIcon } from './fileIcon'
import { kbToMb } from '../../../../utils/file'
import { useAttachment } from '../../hooks/useAttachment'

interface FilesPanelProps {
  files: SubmitMessage.Attachment[]
  onDeleteFiles: (files: SubmitMessage.Attachment[]) => void
}

export const FilesPanel: React.FC<FilesPanelProps> = ({
  files,
  onDeleteFiles,
}) => {
  const { attachmentExtraInfo } = useAttachment()
  return files.length > 0 ? (
    <Grid
      pt="14px"
      px="16px"
      pb="24px"
      gridTemplateColumns={{
        base: '100%',
        md: '50% 50%',
      }}
      gridGap="8px"
    >
      {files.map((file, index) => {
        const extraInfo = attachmentExtraInfo[file.cid as string]
        return (
          <Grid
            // eslint-disable-next-line react/no-array-index-key
            key={`${file.cid}${index}`}
            bg="#f3f3f3"
            rounded="8px"
            h="44px"
            px="6px"
            py="5px"
            fontSize="12px"
            templateColumns="34px calc(100% - 34px - 30px - 16px) 30px"
            gap="8px"
            position="relative"
          >
            <Center w="34px" h="34px" rounded="8px" bg="#fff">
              <FileIcon type={file.contentType} h="24px" w="24px" />
            </Center>
            <Grid h="34px" templateRows="50% 50%">
              <Box
                whiteSpace="nowrap"
                textOverflow="ellipsis"
                overflow="hidden"
              >
                {file.filename}
              </Box>
              <Box>{kbToMb((file.content?.length || 0) * (3 / 4))}MB</Box>
            </Grid>
            {extraInfo && extraInfo?.downloadProgress !== 1 ? (
              <Progress
                position="absolute"
                bottom="-6px"
                h="4px"
                w="full"
                value={(extraInfo.downloadProgress || 0) * 100}
                rounded="10px"
                colorScheme="blue"
                isIndeterminate
              />
            ) : null}

            <Button
              variant="unstyled"
              minW="unset"
              minH="unset"
              h="auto"
              display="inline-flex"
              alignItems="center"
              justifyContent="center"
              onClick={() => {
                onDeleteFiles(
                  files.filter(
                    (deletingFile) =>
                      deletingFile.cid !== file.cid &&
                      deletingFile.filename !== file.filename
                  )
                )
              }}
            >
              <CloseIcon
                w="18px"
                h="18px"
                m="auto"
                color="#6F6F6F"
                bg="#EBEBEB"
                rounded="10px"
                p="4px"
              />
            </Button>
          </Grid>
        )
      })}
    </Grid>
  ) : null
}
