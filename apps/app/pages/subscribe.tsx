import React from 'react'
import { Flex } from '@chakra-ui/react'
import { Logo, PageContainer } from 'ui'
import { Link } from 'react-router-dom'
import { NAVBAR_HEIGHT } from '../constants'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { Subscribe, SubscribeProps } from '../components/Subscribe'
import { AuthModal } from '../components/Auth'
import { RoutePath } from '../route/path'

const Navbar = () => (
  <Flex
    h={`${NAVBAR_HEIGHT}px`}
    alignItems="center"
    justifyContent={['flex-start', 'center', 'center']}
  >
    <Link to={RoutePath.Home}>
      <Logo textProps={{ color: '#231815' }} />
    </Link>
  </Flex>
)

export const SimpleSubscribePage: React.FC<SubscribeProps> = (props) => (
  <>
    <Subscribe {...props} />
    <AuthModal />
  </>
)

export const SubscribePage = () => {
  useDocumentTitle('Subscribe')
  return (
    <PageContainer>
      <Navbar />
      <SimpleSubscribePage />
    </PageContainer>
  )
}
