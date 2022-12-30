import React from 'react'
import { Flex } from '@chakra-ui/react'
import { Logo, PageContainer } from 'ui'
import { Link, useSearchParams } from 'react-router-dom'
import { RewardType } from 'models'
import { NAVBAR_HEIGHT } from '../constants'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { Subscribe } from '../components/Subscribe'
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

export const SubscribePage = () => {
  const [searchParams] = useSearchParams()

  const rewardType = searchParams.get('reward_type')

  useDocumentTitle(
    rewardType === RewardType.AIR ? 'Subscribe Default' : 'Subscribe'
  )

  return (
    <PageContainer>
      <Navbar />
      <Subscribe />
      <AuthModal />
    </PageContainer>
  )
}
