import { Logo, PageContainer } from 'ui'
import React from 'react'
import { Center, Link } from '@chakra-ui/react'
import { useRedirectHome } from '../hooks/useRedirectHome'
import { InboxComponent } from '../components/Inbox'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { Home } from '../components/Home'
import { Navbar } from '../components/Navbar'
import { HOME_URL, NAVBAR_HEIGHT } from '../constants'
import { useRememberLoading } from '../hooks/useRemember'

const UnAuthNavbar = () => (
  <Center h={`${NAVBAR_HEIGHT}px`}>
    <Link isExternal href={HOME_URL}>
      <Logo textProps={{ color: '#231815' }} />
    </Link>
  </Center>
)

export const HomePage = () => {
  const { isAuth } = useRedirectHome()
  useDocumentTitle(isAuth ? 'Inbox' : 'Home')
  const isRememberLoading = useRememberLoading()
  if (!isAuth || isRememberLoading) {
    return (
      <PageContainer>
        <UnAuthNavbar />
        <Home />
      </PageContainer>
    )
  }

  return (
    <>
      <PageContainer>
        <Navbar />
      </PageContainer>
      <InboxComponent />
    </>
  )
}
