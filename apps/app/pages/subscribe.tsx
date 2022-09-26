import React from 'react'
import { Center, Link } from '@chakra-ui/react'
import { Logo, PageContainer } from 'ui'
import { HOME_URL, NAVBAR_HEIGHT } from '../constants'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { Subscribe } from '../components/Subscribe'

const Navbar = () => (
  <Center h={`${NAVBAR_HEIGHT}px`}>
    <Link isExternal href={HOME_URL}>
      <Logo textProps={{ color: '#231815' }} />
    </Link>
  </Center>
)

export const SubscribePage = () => {
  useDocumentTitle('Subscribe')
  return (
    <PageContainer>
      <Navbar />
      <Subscribe />
    </PageContainer>
  )
}
