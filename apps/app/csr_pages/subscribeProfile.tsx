import React from 'react'
import { Flex } from '@chakra-ui/react'
import { Logo, PageContainer } from 'ui'
import NextLink from 'next/link'
import { ConfirmDialog } from 'hooks'
import { NAVBAR_HEIGHT } from '../constants'
import {
  SubscribeProfileBody,
  SubscribeProfileDataProps,
} from '../components/SubscribeProfileBody'
import { RoutePath } from '../route/path'

const Navbar = () => (
  <Flex
    h={`${NAVBAR_HEIGHT}px`}
    alignItems="center"
    justifyContent={['flex-start', 'center', 'center']}
  >
    <NextLink href={RoutePath.Home} passHref>
      <a>
        <Logo textProps={{ color: '#231815' }} />
      </a>
    </NextLink>
  </Flex>
)

export const SubscribeProfile: React.FC<SubscribeProfileDataProps> = (
  props
) => {
  const { priAddress, userInfo, userSettings, uuid, address } = props

  return (
    <>
      <PageContainer>
        <Navbar />
      </PageContainer>
      <SubscribeProfileBody
        uuid={uuid}
        address={address}
        priAddress={priAddress}
        userInfo={userInfo}
        userSettings={userSettings}
      />
      <ConfirmDialog />
    </>
  )
}
