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
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  isEthAddress,
  isPrimitiveEthAddress,
  truncateMailAddress,
  truncateMiddle,
} from 'shared'
import { Avatar, EchoIframe, IpfsInfoTable } from 'ui'
import { ReactComponent as SvgDiamond } from 'assets/subscribe-page/diamond.svg'
import { ChatGPT, Subscription } from 'models'
import { useQuery } from 'react-query'
import { useAtom, useAtomValue } from 'jotai'
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
import { BuyPremium, isBuyingAtom } from './buyPremium'
import { Query } from '../../api/query'
import { subscribeButtonIsFollowAtom } from '../SubscribeButtonInApp'
import { LanguageSelect } from './languageSelect'

const CONTAINER_MAX_WIDTH = 1064

interface SubscriptionArticleBodyProps
  extends Omit<SubscriptionArticleProps, 'previewImage'> {
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
> = ({ priAddress, articleId, detail, uuid, userInfo, ipfsInfo, shareUrl }) => {
  const [t] = useTranslation(['subscription-article', 'common'])
  useAuth()

  const api = useAPI()
  const isMobile = useBreakpointValue({ base: true, md: false })
  const isAuth = useIsAuthenticated()
  const isBuying = useAtomValue(isBuyingAtom)
  const [isFollow, setIsFollow] = useAtom(subscribeButtonIsFollowAtom)
  // eslint-disable-next-line compat/compat
  const lang = new URLSearchParams(window.location.search).get('lang') || ''
  const [currentLang, setCurrentLang] = useState(lang)
  const isPremium = detail.message_type === Subscription.MessageType.Premium

  const { isLoading, data: detailCSR } = useQuery(
    [Query.SubscriptionDetail, isAuth, currentLang],
    async () => {
      const { data } = await api.SubscriptionMessageDetail(
        articleId,
        currentLang !== ChatGPT.OriginalLanguage ? currentLang : ''
      )
      return data
    },
    {
      enabled: true,
      refetchOnMount: true,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  )

  const address = detailCSR?.writer_name || detail.writer_name
  const isNeedPay = isPremium && !detailCSR?.content && !isLoading
  const mailAddress = `${address}@${MAIL_SERVER_URL}`
  const realContent = detailCSR?.content || detail.content
  const isNeedLoading = !realContent && isLoading
  const subject = detailCSR?.subject || detail.subject
  const summary = detailCSR?.summary || detail.summary

  useEffect(() => {
    if (realContent) {
      // report pv
      api.postStatsEvents({ uuid: articleId }).catch(Boolean)

      if (isBuying && !isFollow) {
        api
          .SubscriptionCommunityUserFollowing(uuid)
          .then(() => setIsFollow(true))
          .catch(Boolean)
      }
    }
  }, [realContent])

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

  const EchoBody = !isNeedPay ? (
    <Box
      mt={{ base: '50px', md: '80px' }}
      mb="10px"
      p={{ base: '0 20px', md: '0' }}
    >
      <EchoIframe
        targetUri={`${APP_URL}/${RoutePath.Subscription}/${articleId}`}
        mailAddress={mailAddress}
      />
    </Box>
  ) : null

  return (
    <PageContainer className="family-to-read">
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
          p={{ base: '0 20px 32px', md: '0 32px 48px' }}
          w={{ base: 'full', md: '71.33%' }}
        >
          <LanguageSelect
            articleId={articleId}
            currentLang={currentLang}
            setCurrentLang={setCurrentLang}
            isSSR
          />
          <Text
            mt="24px"
            fontWeight="700"
            fontSize={{ base: '28px', md: '32px' }}
            lineHeight="1.3"
          >
            {subject}
          </Text>

          {isPremium ? (
            <Center
              mt={{ base: '8px', md: '13px' }}
              w="118px"
              h={{ base: '18px', md: '24px' }}
              background="#FFF6D6"
              borderRadius="20px"
            >
              <Icon as={SvgDiamond} w="18px" h="18px" />
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
                {SubFormatDate(detail.created_at, 'MMM D / h:mm A / YYYY')}
              </Box>
              <Spacer />
              <ShareButtonGroup
                spacing="5px"
                shareUrl={shareUrl}
                text={subject}
                iconW="22px"
                articleId={articleId}
              />
            </Flex>
          ) : null}

          {summary ? (
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
                {summary}
              </Text>
            </Box>
          ) : null}

          {isNeedPay ? (
            <BuyPremium
              bitAccount={detail.dot_bit_account}
              uuid={uuid}
              nickname={nickname}
              refetch={() => {
                window.location.reload()
              }}
            />
          ) : null}

          {isNeedLoading ? (
            <Center minH="400px">
              <Spinner />
            </Center>
          ) : null}

          {realContent ? (
            <Box pt={{ base: '10px', md: '30px' }}>
              <RenderHTML
                html={realContent}
                shadowStyle={`main { min-height: 200px; } img[style="max-width: 100%;"] { height: auto }`}
              />
              {ipfsInfo ? (
                <Box mt="8px">
                  <IpfsInfoTable
                    title={t('ipfs')}
                    ethAddress={ipfsInfo?.owner_identifier}
                    ipfs={ipfsInfo?.url}
                    contentDigest={ipfsInfo?.content_digest}
                  />
                </Box>
              ) : null}
            </Box>
          ) : null}
          <Center mt={{ base: '50px', md: '50px' }}>
            <ShareButtonGroup
              spacing="50px"
              shareUrl={shareUrl}
              text={subject}
              iconW="28px"
              articleId={articleId}
            />
          </Center>
          {!isMobile ? EchoBody : null}
        </Box>
      </Flex>
    </PageContainer>
  )
}
