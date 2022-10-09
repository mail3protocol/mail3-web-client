import { Box, Button, Divider, Flex, HStack } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import React, { useState } from 'react'
import { Container } from '../../components/Container'
import { Content, StateProvider, Menus } from '../../components/Editor'
import { SubjectInput } from '../../components/NewMessageComponents'
import { PreviewButton } from '../../components/NewMessageComponents/PreviewButton'
import { PreviewSimulator } from '../../components/NewMessageComponents/PreviewSimulator'

export const NewMessage = () => {
  const { t } = useTranslation('new_message')
  const [subjectText, setSubjectText] = useState('')
  const [isPreview, setIsPreview] = useState(false)
  const [currentPreviewContent, setCurrentPreviewContent] = useState('')

  return (
    <Container as={Flex} flexDirection="column">
      <StateProvider
        placeholder={t('editor_placeholder')}
        as={Flex}
        flexDirection="column"
        flex={1}
      >
        <Menus />
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
            <Content mt="4px" flex={1} />
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
            {!isPreview ? (
              <Button
                variant="solid-rounded"
                colorScheme="blackButton"
                w="138px"
              >
                {t('send')}
              </Button>
            ) : null}
          </HStack>
        </Flex>
      </StateProvider>
    </Container>
  )
}
