import React from 'react'
import { Box, Flex, Spacer } from '@chakra-ui/react'
import { LogoSubscription, PageContainer } from 'ui'
import NextLink from 'next/link'
import { ConfirmDialog } from 'hooks'
import { APP_URL, NAVBAR_HEIGHT } from '../constants'
import {
  SubscribeProfileBody,
  SubscribeProfileDataProps,
} from '../components/SubscribeProfileBody'
import { RoutePath } from '../route/path'
import {
  ShareButtonGroup,
  ShareButtonType,
} from '../components/ShareButtonGroup'

const homeUrl = typeof window !== 'undefined' ? window.location.origin : APP_URL

const Navbar: React.FC<{ shareUrl: string; shareText: string }> = ({
  shareUrl,
  shareText,
}) => (
  <Flex
    h={`${NAVBAR_HEIGHT}px`}
    alignItems="center"
    justifyContent={['flex-start', 'center', 'center']}
  >
    <NextLink href={RoutePath.Home} passHref>
      <a>
        <LogoSubscription />
      </a>
    </NextLink>
    <Spacer />
    <Box display={{ base: 'block', md: 'none' }}>
      <ShareButtonGroup
        spacing="10px"
        shareUrl={shareUrl}
        text={shareText}
        iconW="16px"
        buttonListProps={[ShareButtonType.Twitter, ShareButtonType.Copy]}
      />
    </Box>
  </Flex>
)

export const SubscribeProfile: React.FC<SubscribeProfileDataProps> = (
  props
) => {
  const { priAddress, userInfo, userSettings, uuid, address } = props

  const shareUrl: string = `${homeUrl}/${address}`
  const shareText =
    'Hey, visit my Subscription Page to view my latest content @mail3dao'

  return (
    <>
      <PageContainer>
        <Navbar shareUrl={shareUrl} shareText={shareText} />
      </PageContainer>
      <SubscribeProfileBody
        uuid={uuid}
        address={address}
        priAddress={priAddress}
        userInfo={userInfo}
        userSettings={userSettings}
        shareUrl={shareUrl}
        shareText={shareText}
      />
      <ConfirmDialog />
    </>
  )
}
