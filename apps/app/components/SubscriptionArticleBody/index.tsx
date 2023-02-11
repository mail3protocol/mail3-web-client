import {
  Box,
  Center,
  Flex,
  Icon,
  Link,
  Spacer,
  Spinner,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react'
import styled from '@emotion/styled'
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  isEthAddress,
  isPrimitiveEthAddress,
  truncateMailAddress,
  truncateMiddle,
} from 'shared'
import { ReactComponent as SvgDiamond } from 'assets/subscribe-page/diamond.svg'
import { Avatar, EchoIframe } from 'ui'
import { Subscription } from 'models'
import { useQuery } from 'react-query'
import { APP_URL, MAIL_SERVER_URL } from '../../constants/env'
import { useAPI } from '../../hooks/useAPI'
import { UserInfo } from './userInfo'
import { SubFormatDate } from '../../utils'
import { RenderHTML } from '../Preview/parser'
import { RoutePath } from '../../route/path'
import { useAuth, useIsAuthenticated } from '../../hooks/useLogin'
import { NAVBAR_HEIGHT } from '../../constants'
import { SubscriptionArticleProps } from '../../csr_pages/subscriptionArticle'
import { ShareButtonGroup } from '../ShareButtonGroup'
import { BuyPremium } from './buyPremium'
import { Query } from '../../api/query'

const CONTAINER_MAX_WIDTH = 1064

interface SubscriptionArticleBodyProps
  extends Omit<SubscriptionArticleProps, 'previewImage'> {
  address: string
  shareUrl: string
}

const PageContainer = styled(Box)`
  max-width: ${CONTAINER_MAX_WIDTH}px;
  margin: 0px auto;
  min-height: 500px;
  background-color: #ffffff;
  padding-top: ${NAVBAR_HEIGHT}px;
`

export const SubscriptionArticleBody: React.FC<
  SubscriptionArticleBodyProps
> = ({ address, priAddress, articleId, detail, uuid, userInfo, shareUrl }) => {
  const [t] = useTranslation(['subscription-article', 'common'])
  useAuth()

  const api = useAPI()
  const isMobile = useBreakpointValue({ base: true, md: false })
  const isAuth = useIsAuthenticated()

  const isPremium = detail.message_type === Subscription.MeesageType.Premium

  const {
    isLoading,
    data: detailCSR,
    refetch,
  } = useQuery(
    [Query.SubscriptionDetail],
    async () => {
      const { data } = await api.SubscriptionMessageDetail(articleId)
      return data
    },
    {
      enabled: isPremium && isAuth,
      refetchOnMount: true,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  )

  const isNeedPay = isPremium && !detailCSR?.content && !isLoading
  const mailAddress = `${address}@${MAIL_SERVER_URL}`

  useEffect(() => {
    if (detail?.content) {
      // report pv
      api.postStatsEvents({ uuid: articleId }).catch(Boolean)
    }
  }, [detail?.content])

  const nickname = useMemo(() => {
    if (userInfo?.nickname) {
      return userInfo.nickname
    }
    if (isPrimitiveEthAddress(address)) {
      return truncateMiddle(address, 6, 4, '_')
    }
    if (isEthAddress(address)) {
      return address.includes('.') ? address.split('.')[0] : address
    }
    return ''
  }, [userInfo])

  const EchoBody = (
    <Box
      mt={{ base: '50px', md: '80px' }}
      mb="10px"
      p={{ base: '0 20px', md: '0' }}
    >
      <Text fontWeight="800" fontSize={{ base: '20px', md: '32px' }}>
        Comments
      </Text>
      <EchoIframe
        targetUri={`${APP_URL}/${RoutePath.Subscription}/${articleId}`}
        mailAddress={mailAddress}
      />
    </Box>
  )

  return (
    <PageContainer>
      <Flex direction={{ base: 'column-reverse', md: 'row-reverse' }}>
        {isMobile ? EchoBody : null}
        <UserInfo
          uuid={uuid}
          address={address}
          priAddress={priAddress}
          nickname={nickname}
          mailAddress={mailAddress}
          desc={userInfo.description}
          isAuth={isAuth}
          avatar={userInfo.avatar}
          rewardType={userInfo.reward_type}
        />
        <Box
          minH="500px"
          p={{ base: '32px 20px', md: '48px 32px' }}
          w={{ base: 'full', md: '71.33%' }}
        >
          <Text
            fontWeight="700"
            fontSize={{ base: '24px', md: '32px' }}
            lineHeight="1.3"
          >
            {detail?.subject}
          </Text>

          {isPremium ? (
            <Center
              mt={{ base: '8px', md: '13px' }}
              w="112px"
              h={{ base: '18px', md: '24px' }}
              background="#FFF6D6"
              borderRadius="20px"
            >
              <Icon as={SvgDiamond} w="12px" h="12px" />
              <Box
                ml="2px"
                fontStyle="italic"
                fontWeight="600"
                fontSize="12px"
                lineHeight="14px"
                color="#FFA800"
              >
                {t('premium-only')}
              </Box>
            </Center>
          ) : null}

          {isMobile ? (
            <Flex mt="24px">
              <Link
                display="flex"
                href={`${APP_URL}/${address}`}
                target="_blank"
                alignItems="center"
                onClick={() => {
                  // trackAvatar()
                }}
                w="100%"
              >
                <Avatar
                  w="42px"
                  h="42px"
                  address={address}
                  borderRadius="50%"
                />
                <Box ml="4px" wordBreak="break-all" maxW="180px">
                  <Box fontWeight={700} fontSize="14px">
                    {nickname}
                  </Box>
                  <Box fontWeight={400} fontSize="12px" color="#979797">
                    {truncateMailAddress(mailAddress)}
                  </Box>
                </Box>
              </Link>
              <Spacer />
              <Flex
                fontWeight={500}
                fontSize="12px"
                color="#6F6F6F"
                lineHeight="22px"
                whiteSpace="nowrap"
                alignItems="flex-end"
              >
                {SubFormatDate(detail.created_at, 'YYYY-MM-DD HH:mm')}
              </Flex>
            </Flex>
          ) : null}

          {!isMobile ? (
            <Flex mt="13px" align="center">
              <Box
                fontWeight={500}
                fontSize="14px"
                color="#6F6F6F"
                mt="4px"
                lineHeight="18px"
              >
                {SubFormatDate(detail.created_at, 'YYYY / MMM D / h:mm a')}
              </Box>
              <Spacer />
              <ShareButtonGroup
                spacing="5px"
                shareUrl={shareUrl}
                text={detail.subject}
                iconW="22px"
              />
            </Flex>
          ) : null}

          {detail?.summary ? (
            <Box
              mt="13px"
              background="#EBEBEB"
              borderRadius="12px"
              p="15px"
              overflow="hidden"
            >
              <Text
                fontWeight={{ base: '400', md: '500' }}
                fontSize={{ base: '12px', md: '16px' }}
                lineHeight={{ base: '18px', md: '24px' }}
                color="#333333"
              >
                {detail?.summary}
              </Text>
            </Box>
          ) : null}

          {isNeedPay ? (
            <BuyPremium
              uuid={uuid}
              nickname={nickname}
              refetchArticle={refetch}
            />
          ) : null}

          {isLoading ? (
            <Center minH="400px">
              <Spinner />
            </Center>
          ) : null}

          {detail?.content ? (
            <Box pt={{ base: '10px', md: '30px' }}>
              <RenderHTML
                html={detail?.content}
                shadowStyle={`main { min-height: 200px; } img[style="max-width: 100%;"] { height: auto }`}
              />
            </Box>
          ) : null}
          <Center mt={{ base: '40px', md: '65px' }}>
            <ShareButtonGroup
              spacing="50px"
              shareUrl={shareUrl}
              text={detail.subject}
              iconW="28px"
            />
          </Center>
          {!isMobile ? EchoBody : null}
        </Box>
      </Flex>
    </PageContainer>
  )
}
