import React from 'react'
import { Box, Center, Flex, Text } from '@chakra-ui/react'
import { Logo, PageContainer } from 'ui'
import NextLink from 'next/link'
import styled from '@emotion/styled'
import { Subscription } from 'models'
import { ConfirmDialog, useDynamicSticky } from 'hooks'
import { NAVBAR_HEIGHT } from '../constants'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { RoutePath } from '../route/path'
import { SubscriptionArticleBody } from '../components/SubscriptionArticleBody'
import { UserSettingResponse } from '../api'

const NavArea = styled(Box)`
  width: 100%;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  background-color: #fff;
  position: absolute;
  top: 0;
  z-index: 9;
`

const Navbar = () => (
  <Flex
    h={`${NAVBAR_HEIGHT}px`}
    alignItems="center"
    justifyContent={['flex-start', 'center', 'center']}
  >
    <NextLink href={RoutePath.Subscription} passHref>
      <a>
        <Center>
          <Logo textProps={{ color: '#231815' }} isHiddenText />
          <Text fontWeight="700" fontSize="18px" lineHeight="20px" ml="8px">
            Subscription
          </Text>
        </Center>
      </a>
    </NextLink>
  </Flex>
)

export interface SubscriptionArticleProps {
  errorCode?: number
  detail: Subscription.MessageDetailResp
  priAddress: string
  articleId: string
  uuid: string
  url?: string
  userInfo: { nickname: string; avatar: string } & UserSettingResponse
}

export const SubscriptionArticle: React.FC<SubscriptionArticleProps> = (
  props
) => {
  useDocumentTitle('Subscription Page')

  const { top, position } = useDynamicSticky({ navbarHeight: NAVBAR_HEIGHT })
  const { articleId, detail, uuid, priAddress, userInfo } = props

  return (
    <>
      <NavArea style={{ top, position }}>
        <PageContainer>
          <Navbar />
        </PageContainer>
      </NavArea>
      <SubscriptionArticleBody
        address={detail.writer_name}
        uuid={uuid}
        priAddress={priAddress}
        articleId={articleId}
        detail={detail}
        userInfo={userInfo}
      />
      <ConfirmDialog />
    </>
  )
}
