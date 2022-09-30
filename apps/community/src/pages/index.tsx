import { Box, Button, Flex } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { Content, Footer } from '../components/LoginHomePageComponents'
import { Header } from '../components/Header'
import { useRegisterDialog } from '../hooks/useRegisterDialog'

export const MAX_WIDTH = 1920

const RegisterButton = () => {
  const { t } = useTranslation('common')
  const onOpenRegisterDialog = useRegisterDialog()
  return (
    <Box
      ml="auto"
      h="36px"
      fontSize="16px"
      fontWeight="600"
      bg="rainbow"
      p="2px"
      my="auto"
      rounded="99px"
    >
      <Box
        bg="loginHomePage.background"
        h="full"
        lineHeight="30px"
        rounded="99px"
        px="32px"
      >
        <Box as="span">{t('no_mail3')}</Box>
        <Button
          variant="link"
          color="primary.900"
          _active={{ color: 'primary.900', opacity: 0.6 }}
          onClick={onOpenRegisterDialog}
        >
          {t('register')}
        </Button>
      </Box>
    </Box>
  )
}

export const Index = () => (
  <Flex
    flexDirection="column"
    align="center"
    color="loginHomePage.color"
    bg="loginHomePage.background"
    w="full"
    h="100vh"
    minH="700px"
  >
    <Flex
      direction="column"
      align="center"
      maxW={`${MAX_WIDTH}px`}
      h="full"
      w="full"
    >
      <Header bg="loginHomePage.background" position="static">
        <RegisterButton />
      </Header>
      <Content />
    </Flex>
    <Footer />
  </Flex>
)
