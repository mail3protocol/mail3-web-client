import {
  Box,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Textarea,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import React, { useRef, useState } from 'react'
import { Container } from '../../components/Container'
import { Content, StateProvider, Menus } from '../../components/Editor'
import { SubjectInput } from '../../components/NewMessagePageComponents/SubjectInput'
import { PreviewButton } from '../../components/NewMessagePageComponents/PreviewButton'
import { PreviewSimulator } from '../../components/NewMessagePageComponents/PreviewSimulator'
import { SendButton } from '../../components/NewMessagePageComponents/SendButton'
import { MAIL_CONTENT_IMAGE_QUOTA_KB } from '../../constants/env/config'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

export const NewMessage = () => {
  useDocumentTitle('New Message')
  const { t } = useTranslation('new_message')
  const [subjectText, setSubjectText] = useState('')
  const [abstract, setAbstract] = useState('')
  const [isPreview, setIsPreview] = useState(false)
  const [currentPreviewContent, setCurrentPreviewContent] = useState('')
  const contentRef = useRef<HTMLDivElement>(null)
  const fileMapRef = useRef<Map<string, File>>(new Map())
  const fileCacheMapRef = useRef<Map<string, string>>(new Map())
  const [count, setCount] = useState(0)

  const uploadImageGuard = (file: File) => {
    const currentSize = Array.from(
      new Set(
        Array.from(
          contentRef.current?.shadowRoot?.querySelectorAll('img') || []
        ).map((img) => img.src)
      )
    )
      .map((src) => fileMapRef.current.get(src) as File)
      .filter((f) => f)
      .reduce((acc, f) => acc + f.size, 0)
    if (currentSize + file.size > MAIL_CONTENT_IMAGE_QUOTA_KB * 1024) {
      throw new Error(
        t('mail_image_limit', {
          size: `${MAIL_CONTENT_IMAGE_QUOTA_KB / 1024}MB`,
        })
      )
    }
  }

  const onUploadImageCallback = (file: File, url: string) => {
    fileMapRef.current.set(url, file)
    fileCacheMapRef.current.set(
      file.name + file.size + file.size + file.lastModified,
      url
    )
  }

  const getImageUrlCache = (file: File) =>
    fileCacheMapRef.current.get(
      file.name + file.size + file.size + file.lastModified
    )

  return (
    <Container as={Flex} flexDirection="column">
      <StateProvider
        placeholder={t('editor_placeholder')}
        as={Flex}
        flexDirection="column"
        flex={1}
        onChangeTextLengthCallback={setCount}
      >
        <Flex
          rounded="12px"
          bgColor="cardBackground"
          px="24px"
          py="32px"
          mt="20px"
          flex={1}
          flexDirection="column"
        >
          {isPreview ? (
            <PreviewSimulator
              subject={subjectText}
              html={currentPreviewContent}
            />
          ) : null}
          <Box
            flex={1}
            style={
              isPreview
                ? {
                    position: 'fixed',
                    top: '-100%',
                    left: '-100%',
                    pointerEvents: 'none',
                    opacity: 0,
                  }
                : undefined
            }
          >
            <SubjectInput
              onChange={(e) => setSubjectText(e.target.value)}
              value={subjectText}
            />
            <Divider as="hr" mt="20px" />
            <Menus
              imageButtonProps={{
                uploadImageGuard,
                onUploadImageCallback,
                getImageUrlCache,
              }}
            />
            <Content mt="4px" flex={1} ref={contentRef} />
          </Box>
        </Flex>

        {!isPreview ? (
          <FormControl
            p="32px 24px"
            h="217px"
            background="#FFFFFF"
            borderRadius="20px"
            mt="20px"
          >
            <FormLabel>Abstract</FormLabel>
            <Textarea
              resize="none"
              h="120px"
              value={abstract}
              maxLength={100}
              fontSize="14px"
              fontWeight="500"
              lineHeight="20px"
              onChange={({ target: { value } }) => setAbstract(value)}
            />
            <Box
              whiteSpace="nowrap"
              fontSize="14px"
              color="secondaryTextColor"
              position="absolute"
              bottom="40px"
              right="40px"
              zIndex={99}
              textDecorationLine="underline"
            >
              {abstract.length} / 100
            </Box>
          </FormControl>
        ) : null}

        <HStack
          p="16px 16px 16px 0px"
          justify="flex-end"
          mt="20px"
          bgColor="#FFFFFF"
          boxShadow="0px 0px 8px rgba(0, 0, 0, 0.25)"
          borderRadius="20px"
        >
          <PreviewButton
            isPreview={isPreview}
            onClick={(e, content) => {
              setIsPreview((p) => !p)
              setCurrentPreviewContent(content)
            }}
            w="138px"
            h="40px"
          />
          <SendButton
            abstract={abstract}
            subject={subjectText}
            isDisabled={count === 0}
            h="40px"
          />
        </HStack>
      </StateProvider>
    </Container>
  )
}
