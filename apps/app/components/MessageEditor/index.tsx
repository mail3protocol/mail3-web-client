import { Flex, Heading } from '@chakra-ui/react'
import dynamic from 'next/dynamic'
import React, { useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import { RecipientAndSubject } from './components/recipientAndSubject'
import { EditorProps } from './components/editor'
import { useCardSignature } from './hooks/useCardSignature'

const Editor = dynamic<EditorProps>(
  () => import('./components/editor').then((module) => module.Editor) as any,
  {
    ssr: false,
  }
)

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

  return (
    <Flex
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
      {!isLoading ? <Editor content={defaultContent} /> : null}
    </Flex>
  )
}
