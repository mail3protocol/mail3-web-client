import { Divider, Flex } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { Container } from '../../components/Container'
import { Content, StateProvider, Menus } from '../../components/Editor'
import { SubjectInput } from '../../components/NewMessageComponents'

export const NewMessage = () => {
  const { t } = useTranslation('new_message')
  const [subjectText, setSubjectText] = useState('')
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
          <SubjectInput
            onChange={(e) => setSubjectText(e.target.value)}
            value={subjectText}
          />
          <Divider as="hr" mt="20px" />
          <Content mt="4px" flex={1} />
        </Flex>
      </StateProvider>
    </Container>
  )
}
