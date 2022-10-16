import React from 'react'
import { Center } from '@chakra-ui/react'
import { Logo, PageContainer } from 'ui'
import { Link } from 'react-router-dom'
import { NAVBAR_HEIGHT } from '../constants'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { Subscribe } from '../components/Subscribe'
import { AuthModal } from '../components/Auth'
import { RoutePath } from '../route/path'

const Navbar = () => (
  <Center h={`${NAVBAR_HEIGHT}px`}>
    <Link to={RoutePath.Home}>
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
      <AuthModal />
    </PageContainer>
  )
}
