import React from 'react'
import { Box, Flex, Spacer } from '@chakra-ui/react'
import { LogoSubscription } from 'ui'
import NextLink from 'next/link'
import styled from '@emotion/styled'
import { Subscription, MessageOnChainIdentifierResponse } from 'models'
import { useQuery } from 'react-query'
import { ConfirmDialog, useDynamicSticky } from 'hooks'
import axios from 'axios'
import { APP_URL, NAVBAR_HEIGHT } from '../constants'
import { RoutePath } from '../route/path'
import { SubscriptionArticleBody } from '../components/SubscriptionArticleBody'
import { UserSettingResponse } from '../api'
import { Query } from '../api/query'
import { useAPI } from '../hooks/useAPI'
import { NotificationBar } from '../components/NotificationBar'
import { ShareButtonGroup } from '../components/ShareButtonGroup'

const NavArea = styled(Box)`
  width: 100%;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  background-color: #fff;
  position: absolute;
  top: 0;
  z-index: 9;
`

const Navbar: React.FC<{ shareUrl: string; subject: string }> = ({
  shareUrl,
  subject,
}) => (
  <Flex
    h={`${NAVBAR_HEIGHT}px`}
    alignItems="center"
    justifyContent={['flex-start', 'center', 'center']}
    p="0 20px"
  >
    <NextLink href={RoutePath.Subscription} passHref>
      <a>
        <LogoSubscription />
      </a>
    </NextLink>
    <Spacer />
    <Box display={{ base: 'block', md: 'none' }}>
      <ShareButtonGroup
        spacing="10px"
        shareUrl={shareUrl}
        text={subject}
        iconW="16px"
      />
    </Box>
  </Flex>
)

export interface SubscriptionArticleProps {
  errorCode?: number
  detail: Subscription.MessageDetailResp
  priAddress: string
  articleId: string
  previewImage: string
  uuid: string
  url?: string
  ipfsInfo: MessageOnChainIdentifierResponse | null
  userInfo: { nickname: string; avatar: string } & UserSettingResponse
}

export const SubscriptionArticle: React.FC<SubscriptionArticleProps> = (
  props
) => {
  const { top, position } = useDynamicSticky({ navbarHeight: NAVBAR_HEIGHT })
  const { articleId, detail, uuid, priAddress, userInfo, ipfsInfo } = props
  const api = useAPI()

  const { data: info } = useQuery(
    [Query.SubscriptionArticleInit, priAddress],
    async () => {
      const res = await Promise.all([
        api.getSubscribeUserInfo(priAddress),
        api.getUserSetting(priAddress),
      ]).then((r) => ({
        ...r[0].data,
        ...r[1].data,
      }))
      return res
    },
    {
      initialData: userInfo,
      refetchOnMount: true,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      onSuccess(data) {
        try {
          const shouldRevalidate =
            JSON.stringify(data) !== JSON.stringify(userInfo)
          if (shouldRevalidate) {
            axios
              .post(`${location.origin}/api/revalidate/subscribe/page`, {
                data: {
                  id: articleId,
                },
              })
              .catch(Boolean)
          }
        } catch (error) {
          //
        }
      },
    }
  )

  const shareUrl = `${APP_URL}/p/${articleId}`

  return (
    <>
      <NavArea style={{ top, position }}>
        <Box w="full">
          <Navbar shareUrl={shareUrl} subject={detail.subject} />
          <NotificationBar uuid={uuid} />
        </Box>
      </NavArea>
      <SubscriptionArticleBody
        uuid={uuid}
        priAddress={priAddress}
        ipfsInfo={ipfsInfo}
        articleId={articleId}
        detail={detail}
        shareUrl={shareUrl}
        userInfo={info || userInfo}
      />
      <ConfirmDialog />
    </>
  )
}
