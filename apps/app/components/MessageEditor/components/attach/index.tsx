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
import { useTranslation } from 'react-i18next'
import { AttachActivationButton } from './attachActivationButton'
import { FilesPanel } from './filesPanel'
import { convertFileToBase64, kbToMb } from '../../../../utils/file'
import {
  AttachmentExtraInfoObject,
  useAttachment,
} from '../../hooks/useAttachment'
import { generateAttachmentContentId } from '../../../../utils'
import { hasFilenameSpecialCharacters } from '../../../../utils/editor'

export const FILENAME_BASE64_CHATS_LIMIT = 5242880
export const FILESIZE_LIMIT = FILENAME_BASE64_CHATS_LIMIT * (3 / 4)
export const MAXIMUM_LENGTH_OF_FILE = 255

export enum FilenameVerifyErrorType {
  None = 'none',
  SpecialCharacters = 'special_characters',
  Space = 'space',
  TooLong = 'too_long',
  TooLarge = 'too_large',
}

export interface Rule {
  type: FilenameVerifyErrorType
  match: (file: File) => boolean
}

const fileVerifyRules: Rule[] = [
  {
    type: FilenameVerifyErrorType.SpecialCharacters,
    match: ({ name }) => hasFilenameSpecialCharacters(name),
  },
  {
    type: FilenameVerifyErrorType.Space,
    match: ({ name }) => name.includes(' '),
  },
  {
    type: FilenameVerifyErrorType.TooLong,
    match: ({ name }) => name.length > MAXIMUM_LENGTH_OF_FILE,
  },
  {
    type: FilenameVerifyErrorType.TooLong,
    match: ({ name }) => name[0] === '.',
  },
  {
    type: FilenameVerifyErrorType.TooLarge,
    match: ({ size }) => size > FILESIZE_LIMIT,
  },
]

export const Attach: React.FC<{
  onChangeFiles?: (files: SubmitMessage.Attachment[]) => void
}> = ({ onChangeFiles }) => {
  const { t } = useTranslation('edit-message')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    attachments: files,
    setAttachments: setFiles,
    setAttachmentExtraInfo,
  } = useAttachment()
  const inputRef = useRef<HTMLInputElement>(null)
  const dialog = useDialog()

  const markFilesByRules = (unmarkedFiles: File[]) =>
    unmarkedFiles.map((file) => ({
      file,
      marks: fileVerifyRules
        .filter((rule) => rule.match(file))
        .map((rule) => rule.type),
    }))

  const convertFileMarkMap = (
    filesWithMarks: ReturnType<typeof markFilesByRules>
  ) =>
    filesWithMarks.reduce<{
      [key in FilenameVerifyErrorType]: File[]
    }>(
      (acc, f) => {
        f.marks.forEach((mark) => {
          acc[mark] = [...acc[mark], f.file]
        })
        if (f.marks.length === 0) {
          acc[FilenameVerifyErrorType.None] = [
            ...acc[FilenameVerifyErrorType.None],
            f.file,
          ]
        }
        return acc
      },
      {
        [FilenameVerifyErrorType.None]: [],
        [FilenameVerifyErrorType.SpecialCharacters]: [],
        [FilenameVerifyErrorType.Space]: [],
        [FilenameVerifyErrorType.TooLong]: [],
        [FilenameVerifyErrorType.TooLarge]: [],
      }
    )

  const handleFileVerifyError = (
    filesWithMarks: ReturnType<typeof markFilesByRules>,
    fileMarkMap: ReturnType<typeof convertFileMarkMap>
  ) => {
    const filterOverSizeFiles = fileMarkMap.too_large
    const firstHasErrorMarkFile = filesWithMarks.find(
      (file) => file.marks.length > 0
    )
    const filenameErrorTitle = (
      {
        [FilenameVerifyErrorType.SpecialCharacters]: t(
          'filename_verify.special_characters'
        ),
        [FilenameVerifyErrorType.Space]: t('filename_verify.space'),
        [FilenameVerifyErrorType.TooLong]: t('filename_verify.too_long'),
      } as { [key in FilenameVerifyErrorType]?: string }
    )[firstHasErrorMarkFile?.marks[0] || FilenameVerifyErrorType.None]

    if (filterOverSizeFiles.length > 0) {
      dialog({
        type: 'error',
        title: t('file_over_title'),
        description: (
          <>
            {t('file_size_up_to', { size: `${kbToMb(FILESIZE_LIMIT)}MB` })}
            {fileMarkMap.too_large
              .map((a, i) => ({ filename: a.name, key: i }))
              .map(({ filename, key }) => (
                <Box fontWeight="bold" key={key}>
                  {filename}
                </Box>
              ))}
          </>
        ),
      })
    } else if (firstHasErrorMarkFile && filenameErrorTitle) {
      dialog({
        type: 'error',
        title: filenameErrorTitle,
        description: firstHasErrorMarkFile.file.name,
      })
    }
  }

  const onUploadFiles: ChangeEventHandler<HTMLInputElement> = useCallback(
    async (e) => {
      const filesWithMarks = markFilesByRules(Array.from(e.target.files || []))
      const fileMarkMap = convertFileMarkMap(filesWithMarks)
      handleFileVerifyError(filesWithMarks, fileMarkMap)
      const uploadingFiles: SubmitMessage.Attachment[] = await Promise.all(
        fileMarkMap.none.map<Promise<SubmitMessage.Attachment>>(
          async (file) => {
            const content = (await convertFileToBase64(file)).split(',')[1]
            return {
              filename: file.name,
              contentDisposition: 'attachment',
              contentType: file.type || 'text/plain',
              content,
              cid: await generateAttachmentContentId(content),
            }
          }
        )
      )
      const attachmentExtraInfo =
        uploadingFiles.reduce<AttachmentExtraInfoObject>(
          (acc, f) => ({ ...acc, [f.cid as string]: { downloadProgress: 1 } }),
          {}
        )
      setFiles((f) => f.concat(uploadingFiles))
      setAttachmentExtraInfo((info) => ({ ...info, attachmentExtraInfo }))
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
