import { Center, Flex, Heading, Spinner } from '@chakra-ui/react'
import React, { useEffect, lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import styled from '@emotion/styled'
import { RecipientAndSubject } from './components/recipientAndSubject'
import { useCardSignature } from './hooks/useCardSignature'

const Editor = lazy(() => import('./components/editor'))

const FocusThemeContainer = styled(Flex)`
  button:focus {
    outline-color: rgba(0, 0, 0, 0.3) !important;
  }
`

export interface MessageEditorProps {
  defaultContent: string
  isEnableCardSignature: boolean
  isLoading?: boolean
}

export const MessageEditor: React.FC<MessageEditorProps> = ({
  defaultContent,
  isEnableCardSignature,
  isLoading,
}) => {
  const { t } = useTranslation('edit-message')
  const { setIsEnableCardSignature } = useCardSignature()
  useEffect(() => {
    setIsEnableCardSignature(isEnableCardSignature)
  }, [isEnableCardSignature])

  const loadingEl = (
    <Center minH="200px">
      <Spinner />
    </Center>
  )

  return (
    <FocusThemeContainer
      w="full"
      h="100%"
      minH={{ base: 'calc(100vh - 60px)', md: 'calc(100vh - 100px)' }}
      mt={{
        base: '0',
        md: '40px',
      }}
      bg="#fff"
      borderTopRadius="24px"
      direction="column"
      shadow={{
        base: 'none',
        md: '0 0 10px 4px rgba(25, 25, 100, 0.1)',
      }}
      px={{
        base: '0',
        md: '62px',
      }}
      pt={{
        base: '20px',
        md: '48px',
      }}
      position="relative"
      transition="200ms"
    >
      <Heading
        lineHeight="40px"
        fontWeight="bold"
        fontSize="28px"
        px={{
          base: '20px',
          md: '0',
        }}
        mb={{
          base: '20px',
          md: '30px',
        }}
      >
        {t('title')}
      </Heading>
      <RecipientAndSubject />
      {!isLoading ? (
        <Suspense fallback={loadingEl}>
          <Editor content={defaultContent} />
        </Suspense>
      ) : (
        loadingEl
      )}
    </FocusThemeContainer>
  )
}
