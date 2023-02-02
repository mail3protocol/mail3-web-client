import {
  Box,
  Center,
  Flex,
  Link,
  Spacer,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react'
import styled from '@emotion/styled'
import { useEffect, useMemo } from 'react'
import {
  isEthAddress,
  isPrimitiveEthAddress,
  truncateMailAddress,
  truncateMiddle,
} from 'shared'
import { Avatar, EchoIframe, IpfsInfoTable } from 'ui'
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

const CONTAINER_MAX_WIDTH = 1064

interface SubscriptionArticleBodyProps
  extends Omit<SubscriptionArticleProps, 'previewImage'> {
  address: string
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
> = ({ address, priAddress, articleId, detail, uuid, userInfo, ipfsInfo }) => {
  useAuth()

  const api = useAPI()
  const isMobile = useBreakpointValue({ base: true, md: false })
  const isAuth = useIsAuthenticated()

  const shareUrl: string = useMemo(
    () => `${APP_URL}/p/${articleId}`,
    [articleId]
  )
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
      <Flex direction={{ base: 'column-reverse', md: 'row' }}>
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

          {isMobile ? (
            <Link
              display="flex"
              href={`${APP_URL}/${address}`}
              target="_blank"
              alignItems="center"
              onClick={() => {
                // trackAvatar()
              }}
              mt="30px"
              w="100%"
            >
              <Avatar w="42px" h="42px" address={address} borderRadius="50%" />
              <Box ml="4px" wordBreak="break-all">
                <Box fontWeight={700} fontSize="14px">
                  {nickname}
                </Box>
                <Box fontWeight={400} fontSize="12px" color="#979797">
                  {truncateMailAddress(mailAddress)}
                </Box>
              </Box>
            </Link>
          ) : null}

          <Flex m="23px 0" align="center">
            <Box
              fontWeight={500}
              fontSize="14px"
              color="#6F6F6F"
              mt="4px"
              lineHeight="18px"
            >
              {SubFormatDate(detail.created_at)}
            </Box>
            <Spacer />
            <ShareButtonGroup
              spacing="5px"
              shareUrl={shareUrl}
              text={detail.subject}
              iconW="22px"
            />
          </Flex>

          {detail?.summary ? (
            <Box
              background="#EBEBEB"
              borderRadius="12px"
              p="15px"
              overflow="hidden"
            >
              <Text
                fontWeight="500"
                fontSize="16px"
                lineHeight="24px"
                color="#333333"
                noOfLines={2}
              >
                {detail?.summary}
              </Text>
            </Box>
          ) : null}

          <Box pt={{ base: '10px', md: '30px' }}>
            <RenderHTML
              html={detail?.content}
              shadowStyle={`main { min-height: 200px; } img[style="max-width: 100%;"] { height: auto }`}
            />
            {ipfsInfo ? (
              <IpfsInfoTable
                ethAddress={ipfsInfo?.owner_identifier}
                ipfs={ipfsInfo?.url}
                contentDigest={ipfsInfo?.content_digest}
              />
            ) : null}
            <Center mt={{ base: '40px', md: '65px' }}>
              <ShareButtonGroup
                spacing="50px"
                shareUrl={shareUrl}
                text={detail.subject}
                iconW="28px"
              />
            </Center>
          </Box>
          {!isMobile ? EchoBody : null}
        </Box>
      </Flex>
    </PageContainer>
  )
}
