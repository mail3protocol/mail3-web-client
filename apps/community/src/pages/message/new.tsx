import { Box, Divider, Flex, HStack } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container } from '../../components/Container'
import { Content, StateProvider, Menus } from '../../components/Editor'
import { SubjectInput } from '../../components/NewMessagePageComponents/SubjectInput'
import { PreviewButton } from '../../components/NewMessagePageComponents/PreviewButton'
import { PreviewSimulator } from '../../components/NewMessagePageComponents/PreviewSimulator'
import { SendButton } from '../../components/NewMessagePageComponents/SendButton'
import { MAIL_CONTENT_IMAGE_QUOTA_KB } from '../../constants/env/config'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { RoutePath } from '../../route/path'

export const NewMessage = () => {
  useDocumentTitle('New Message')
  const { t } = useTranslation('new_message')
  const [subjectText, setSubjectText] = useState('')
  const [isPreview, setIsPreview] = useState(false)
  const [currentPreviewContent, setCurrentPreviewContent] = useState('')
  const contentRef = useRef<HTMLDivElement>(null)
  const fileMapRef = useRef<Map<string, File>>(new Map())
  const fileCacheMapRef = useRef<Map<string, string>>(new Map())
  const navi = useNavigate()

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
      >
        <Menus
          imageButtonProps={{
            uploadImageGuard,
            onUploadImageCallback,
            getImageUrlCache,
          }}
        />
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
                  }
                : undefined
            }
          >
            <SubjectInput
              onChange={(e) => setSubjectText(e.target.value)}
              value={subjectText}
            />
            <Divider as="hr" mt="20px" />
            <Content mt="4px" flex={1} ref={contentRef} />
          </Box>
          <HStack justify="flex-end">
            <PreviewButton
              isPreview={isPreview}
              onClick={(e, content) => {
                setIsPreview((p) => !p)
                setCurrentPreviewContent(content)
              }}
              w="138px"
            />
            <SendButton
              subject={subjectText}
              onSend={() => {
                navi(RoutePath.Dashboard)
              }}
            />
          </HStack>
        </Flex>
      </StateProvider>
    </Container>
  )
}
