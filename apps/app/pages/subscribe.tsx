import React, { useEffect } from 'react'
import { Flex } from '@chakra-ui/react'
import { Logo, PageContainer } from 'ui'
import { Link, useSearchParams } from 'react-router-dom'
import { RewardType } from 'models'
import { atom } from 'jotai'
import { useUpdateAtom } from 'jotai/utils'
import { NAVBAR_HEIGHT } from '../constants'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { Subscribe, SubscribeProps } from '../components/Subscribe'
import { AuthModal } from '../components/Auth'
import { RoutePath } from '../route/path'

export const rewardTypeAtom = atom<RewardType>(RewardType.NFT)

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
  const [searchParams] = useSearchParams()
  const rewardType = searchParams.get('reward_type')
  const updateRewardType = useUpdateAtom(rewardTypeAtom)

  useDocumentTitle(
    rewardType === RewardType.AIR ? 'Subscribe Default' : 'Subscribe'
  )

  useEffect(() => {
    if (rewardType === RewardType.AIR || rewardType === RewardType.NFT)
      updateRewardType(rewardType)
  }, [])

  return (
    <PageContainer>
      <Navbar />
      <SimpleSubscribePage />
    </PageContainer>
  )
}
