import React from 'react'
import { Box, Center, Flex, Text } from '@chakra-ui/react'
import { Logo } from 'ui'
import NextLink from 'next/link'
import styled from '@emotion/styled'
import { useQuery } from 'react-query'
import { Subscription } from 'models'
import { ConfirmDialog, useDynamicSticky } from 'hooks'
import axios from 'axios'
import { NAVBAR_HEIGHT } from '../constants'
import { RoutePath } from '../route/path'
import { SubscriptionArticleBody } from '../components/SubscriptionArticleBody'
import { UserSettingResponse } from '../api'
import { Query } from '../api/query'
import { useAPI } from '../hooks/useAPI'
import { NotificationBar } from '../components/NotificationBar'

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
    p="0 20px"
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
  previewImage: string
  uuid: string
  url?: string
  userInfo: { nickname: string; avatar: string } & UserSettingResponse
}

export const SubscriptionArticle: React.FC<SubscriptionArticleProps> = (
  props
) => {
  const { top, position } = useDynamicSticky({ navbarHeight: NAVBAR_HEIGHT })
  const { articleId, detail, uuid, priAddress, userInfo } = props
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

  return (
    <>
      <NavArea style={{ top, position }}>
        <Box w="full">
          <Navbar />
          <NotificationBar />
        </Box>
      </NavArea>
      <SubscriptionArticleBody
        address={detail.writer_name}
        uuid={uuid}
        priAddress={priAddress}
        articleId={articleId}
        detail={detail}
        userInfo={info || userInfo}
      />
      <ConfirmDialog />
    </>
  )
}
