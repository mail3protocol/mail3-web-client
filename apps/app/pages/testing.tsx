import React from 'react'
import { Center, Link } from '@chakra-ui/react'
import { Logo, PageContainer } from 'ui'
import { HOME_URL, NAVBAR_HEIGHT } from '../constants'
import { Testing } from '../components/Testing'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

const Navbar = () => (
  <Center h={`${NAVBAR_HEIGHT}px`}>
    <Link isExternal href={HOME_URL}>
      <Logo textProps={{ color: '#231815' }} />
    </Link>
  </Center>
)

export const TestingPage = () => {
  useDocumentTitle('Beta')
  return (
    <PageContainer>
      <Navbar />
      <Testing />
    </PageContainer>
  )
}
