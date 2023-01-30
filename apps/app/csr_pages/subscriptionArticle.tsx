import React from 'react'
import { Box, Center, Flex, Spinner, Text } from '@chakra-ui/react'
import { Logo, PageContainer } from 'ui'
import NextLink from 'next/link'
import { useQuery } from 'react-query'
import { isPrimitiveEthAddress, isSupportedAddress } from 'shared'
import styled from '@emotion/styled'
import { useTranslation } from 'react-i18next'
import { Subscription } from 'models'
// import { ConfirmDialog } from 'hooks/src/useDialog'
import { MAIL_SERVER_URL, NAVBAR_HEIGHT } from '../constants'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

import { RoutePath } from '../route/path'
import { useAPI } from '../hooks/useAPI'
import { Query } from '../api/query'
import { SubscriptionArticleBody } from '../components/SubscriptionArticleBody'

const ErrPage = styled(Center)`
  height: 100vh;

  .code {
    display: inline-block;
    border-right: 1px solid rgba(0, 0, 0, 0.3);
    margin: 0;
    margin-right: 20px;
    padding: 10px 23px 10px 0;
    font-size: 24px;
    font-weight: 500;
    vertical-align: top;
  }
  .text {
    display: inline-block;
    text-align: left;
    line-height: 49px;
    height: 49px;
    vertical-align: middle;
    font-size: 14px;
  }
`
const NavArea = styled(Box)`
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  background-color: #fff;
  position: sticky;
  top: 0;
  z-index: 9;
`

const Navbar = () => (
  <Flex
    h={`${NAVBAR_HEIGHT}px`}
    alignItems="center"
    justifyContent={['flex-start', 'center', 'center']}
  >
    <NextLink href={RoutePath.Home} passHref>
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
}

export const SubscriptionArticle: React.FC<SubscriptionArticleProps> = (
  props
) => {
  useDocumentTitle('Subscription Page')
  const [t] = useTranslation('subscribe-profile')
  const { articleId } = props
  const api = useAPI()

  const { data: detail } = useQuery<Subscription.MessageDetailResp>(
    [Query.SubscriptionDetail, articleId],
    async () => {
      const messageDetail = await api.SubscriptionMessageDetail(articleId)
      return messageDetail.data
    },
    {
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      enabled: !!articleId,
      initialData: props.detail,
    }
  )

  const address = detail?.writer_name || ''

  const { isLoading, data, error } = useQuery(
    [Query.SubscriptionArticleInit],
    async () => {
      const uuid =
        (await api
          .checkIsProject(address)
          .then((res) => (res.status === 200 ? res.data.uuid : ''))) || ''

      const priAddress = isPrimitiveEthAddress(address)
        ? address
        : await api
            .getPrimitiveAddress(address)
            .then((res) => (res.status === 200 ? res.data.eth_address : ''))

      return {
        priAddress,
        uuid,
      }
    },
    {
      enabled: isSupportedAddress(address),
      initialData: {
        priAddress: props.priAddress,
        uuid: props.uuid,
      },
    }
  )

  if (!articleId || error) {
    return (
      <ErrPage>
        <Center>
          <Box className="code">404</Box>
          <Box className="text">{t('404')}</Box>
        </Center>
      </ErrPage>
    )
  }

  if (isLoading || !data?.uuid || !data?.priAddress || !detail) {
    return (
      <ErrPage>
        <Spinner />
      </ErrPage>
    )
  }

  return (
    <>
      <NavArea>
        <PageContainer>
          <Navbar />
        </PageContainer>
      </NavArea>
      <SubscriptionArticleBody
        mailAddress={`${address}@${MAIL_SERVER_URL}`}
        address={address}
        uuid={data.uuid}
        priAddress={data.priAddress}
        articleId={articleId}
        detail={detail}
      />
      {/* <ConfirmDialog /> */}
    </>
  )
}
