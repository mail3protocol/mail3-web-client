import { Flex } from '@chakra-ui/react'
import { Content, Footer } from '../components/LoginHomePageComponents'
import { Header } from '../components/Header'

export const MAX_WIDTH = 1920

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
      <Header bg="loginHomePage.background" position="static" />
      <Content />
    </Flex>
    <Footer />
  </Flex>
)
