import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  useDisclosure,
} from '@chakra-ui/react'
import React, {
  ChangeEventHandler,
  useCallback,
  useEffect,
  useRef,
} from 'react'
import { TrackEvent, useDialog, useTrackClick } from 'hooks'
import { SubmitMessage } from 'models/src/submitMessage'
import { useTranslation } from 'next-i18next'
import { AttachActivationButton } from './attachActivationButton'
import { FilesPanel } from './filesPanel'
import { convertFileToBase64, kbToMb } from '../../../../utils/file'
import { useAttachment } from '../../hooks/useAttachment'
import { generateUuid } from '../../../../utils'

export const FILENAME_BASE64_CHATS_LIMIT = 5242880
export const FILESIZE_LIMIT = FILENAME_BASE64_CHATS_LIMIT * (3 / 4)

export const Attach: React.FC<{
  onChangeFiles?: (files: SubmitMessage.Attachment[]) => void
}> = ({ onChangeFiles }) => {
  const { t } = useTranslation('edit-message')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { attachments: files, setAttachments: setFiles } = useAttachment()
  const inputRef = useRef<HTMLInputElement>(null)
  const dialog = useDialog()
  const onUploadFiles: ChangeEventHandler<HTMLInputElement> = useCallback(
    async (e) => {
      const targetFiles: SubmitMessage.Attachment[] = await Promise.all(
        Array.from(e.target.files || []).map<Promise<SubmitMessage.Attachment>>(
          async (file) => ({
            filename: file.name,
            contentDisposition: 'attachment',
            contentType: file.type || 'text/plain',
            content: (await convertFileToBase64(file)).split(',')[1],
            cid: generateUuid(),
          })
        )
      )
      const { filterOverSizeFiles, uploadingFiles } = targetFiles.reduce<{
        filterOverSizeFiles: SubmitMessage.Attachment[]
        uploadingFiles: SubmitMessage.Attachment[]
      }>(
        (acc, f) =>
          f.content.length <= FILENAME_BASE64_CHATS_LIMIT
            ? {
                ...acc,
                uploadingFiles: acc.uploadingFiles.concat(f),
              }
            : {
                ...acc,
                filterOverSizeFiles: acc.filterOverSizeFiles.concat(f),
              },
        {
          filterOverSizeFiles: [],
          uploadingFiles: [],
        }
      )
      if (filterOverSizeFiles.length > 0) {
        dialog({
          type: 'error',
          title: t('file_over_title'),
          description: (
            <>
              {t('file_size_up_to', { size: `${kbToMb(FILESIZE_LIMIT)}MB` })}
              {filterOverSizeFiles
                .map((a, i) => ({ filename: a.filename, i }))
                .map((a) => (
                  <Box fontWeight="bold" key={a.i}>
                    {a.filename}
                  </Box>
                ))}
            </>
          ),
        })
      }
      setFiles((f) => f.concat(uploadingFiles))
      e.target.value = ''
    },
    []
  )
  const trackClickAttachFiles = useTrackClick(
    TrackEvent.AppEditMessageClickAttachFiles
  )
  useEffect(() => {
    onChangeFiles?.(files)
    if (files.length === 0) {
      onClose()
    }
  }, [files])
  useEffect(() => {
    window.addEventListener('resize', onClose)
    return () => {
      window.removeEventListener('resize', onClose)
    }
  }, [onClose])
  const headerContent = (
    <Box
      fontWeight="bold"
      h="60px"
      lineHeight="60px"
      p="0"
      textAlign="center"
      position="relative"
      fontSize={{
        base: '14px',
        md: '16px',
      }}
    >
      {t('attach_files')}
      <Button
        variant="unstyled"
        position="absolute"
        right="16px"
        top="10px"
        fontSize="14px"
        color="#4E52F5"
        lineHeight="40px"
        onClick={() => inputRef.current?.click()}
      >
        {t('add_attach_files')}
      </Button>
    </Box>
  )
  const noInlineFiles = files.filter(
    (file) => file.contentDisposition !== 'inline'
  )
  const bodyContent = (
    <FilesPanel files={noInlineFiles} onDeleteFiles={setFiles} />
  )
  const uploadPanelEl = (
    <>
      <Popover
        placement="top-start"
        onOpen={() => {
          trackClickAttachFiles()
        }}
      >
        <PopoverTrigger>
          <Box as="span" display={{ base: 'none', md: 'inline' }}>
            <AttachActivationButton fileCount={noInlineFiles.length} />
          </Box>
        </PopoverTrigger>
        <PopoverContent
          rounded="20px"
          shadow="0 0 16px 12px rgba(192, 192, 192, 0.25)"
          _focus={{
            shadow: '0 0 16px 12px rgba(192, 192, 192, 0.25)',
          }}
          w={{
            base: 'calc(100vw - 40px)',
            md: '400px',
          }}
        >
          <PopoverArrow />
          <PopoverHeader p="0">{headerContent}</PopoverHeader>
          <PopoverBody minH="126px" p="0">
            {bodyContent}
          </PopoverBody>
        </PopoverContent>
      </Popover>
      <AttachActivationButton
        onClick={() => {
          trackClickAttachFiles()
          onOpen()
        }}
        fileCount={files.length}
        display={{ base: 'inline-block', md: 'none' }}
      />
      <Drawer placement="bottom" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent maxH="calc(100vh - 100px)">
          <DrawerHeader borderBottomWidth="1px" p="0">
            {headerContent}
          </DrawerHeader>
          <DrawerBody minH="126px" p="0">
            {bodyContent}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )

  return (
    <>
      <Input
        type="file"
        ref={inputRef}
        position="fixed"
        opacity={0}
        top="-100px"
        left="-100px"
        multiple
        onChange={onUploadFiles}
        w="0"
        h="0"
      />
      {files.length > 0 ? (
        uploadPanelEl
      ) : (
        <AttachActivationButton
          onClick={() => {
            trackClickAttachFiles()
            inputRef.current?.click()
          }}
          fileCount={files.length}
        />
      )}
    </>
  )
}
