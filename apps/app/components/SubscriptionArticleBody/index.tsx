import {
  Box,
  Center,
  Flex,
  HStack,
  Image,
  Link,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Spacer,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react'
import styled from '@emotion/styled'
import { useMemo } from 'react'
import { useToast } from 'hooks'
import { useQuery } from 'react-query'
import { useTranslation } from 'react-i18next'
import {
  copyText,
  isEthAddress,
  isPrimitiveEthAddress,
  shareToTelegram,
  shareToTwitter,
  truncateMiddle,
} from 'shared'
import { Subscription } from 'models'
import SvgCopy from 'assets/subscription/copy.svg'
import SvgTelegram from 'assets/subscription/telegram.svg'
import SvgTwitter from 'assets/subscription/twitter.svg'
import { Avatar, EchoIframe } from 'ui'
import { APP_URL } from '../../constants/env'
import { useAPI } from '../../hooks/useAPI'
import { UserInfo } from './userInfo'
import { SubFormatDate } from '../../utils'
import { RenderHTML } from '../Preview/parser'
import { RoutePath } from '../../route/path'

const CONTAINER_MAX_WIDTH = 1064

interface SubscriptionArticleBodyProps {
  mailAddress: string
  address: string
  uuid: string
  priAddress: string
  articleId: string
  detail: Subscription.MessageDetailResp
}

const PageContainer = styled(Box)`
  max-width: ${CONTAINER_MAX_WIDTH}px;
  margin: 0px auto;
  min-height: 500px;
  background-color: #ffffff;
`

enum ButtonType {
  Copy,
  Telegram,
  Twitter,
}

export const SubscriptionArticleBody: React.FC<
  SubscriptionArticleBodyProps
> = ({ mailAddress, address, priAddress, articleId, detail, uuid }) => {
  const [t] = useTranslation(['subscription-article', 'common'])
  const toast = useToast()
  const api = useAPI()
  const isMobile = useBreakpointValue({ base: true, md: false })

  const shareUrl: string = useMemo(
    () => `${APP_URL}/p/${articleId}`,
    [articleId]
  )

  const shareText: string = useMemo(
    () => `${detail.subject} ${shareUrl} via @mail3dao`,
    [detail]
  )

  const { data: userInfo } = useQuery(
    ['userInfo', priAddress],
    async () => {
      const ret = await api.getSubscribeUserInfo(priAddress)
      return ret.data
    },
    {
      refetchIntervalInBackground: false,
      refetchOnMount: true,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  )

  const { data: settings } = useQuery(
    ['userSetting', priAddress],
    async () => {
      const res = await api.getUserSetting(priAddress)
      return res.data
    },
    {
      refetchIntervalInBackground: false,
      refetchOnMount: true,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  )

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

  const buttonConfig: Record<
    ButtonType,
    {
      Icon: any
      label: string
      onClick: () => void
    }
  > = {
    [ButtonType.Telegram]: {
      Icon: SvgTelegram,
      label: t('telegram'),
      onClick: () => {
        shareToTelegram({
          text: shareText,
          url: shareUrl,
        })
      },
    },
    [ButtonType.Copy]: {
      Icon: SvgCopy,
      label: t('copy'),
      onClick: async () => {
        await copyText(shareUrl)
        toast(t('navbar.copied', { ns: 'common' }))
      },
    },
    [ButtonType.Twitter]: {
      Icon: SvgTwitter,
      label: t('twitter'),
      onClick: () => {
        shareToTwitter({
          text: shareText,
          url: shareUrl,
        })
      },
    },
  }

  const buttonList = [ButtonType.Telegram, ButtonType.Copy, ButtonType.Twitter]

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
          priAddress={priAddress}
          nickname={nickname}
          mailAddress={mailAddress}
          desc={settings?.description}
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
            >
              <Avatar w="42px" h="42px" address={address} borderRadius="50%" />
              <Box ml="4px">
                <Box fontWeight={700} fontSize="14px">
                  {nickname}
                </Box>
                <Box fontWeight={400} fontSize="12px" color="#979797">
                  {mailAddress}
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
            <HStack spacing="5px">
              {buttonList.map((type: ButtonType) => {
                const { Icon, label, onClick } = buttonConfig[type]

                return (
                  <Popover
                    arrowSize={8}
                    key={type}
                    trigger="hover"
                    placement="top-start"
                    size="md"
                  >
                    <PopoverTrigger>
                      <Box as="button" p="5px" onClick={onClick}>
                        <Image src={Icon} w="22px" h="22px" />
                      </Box>
                    </PopoverTrigger>
                    <PopoverContent width="auto">
                      <PopoverArrow />
                      <PopoverBody
                        whiteSpace="nowrap"
                        fontSize="14px"
                        justifyContent="center"
                      >
                        {label}
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                )
              })}
            </HStack>
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
            <Center mt={{ base: '40px', md: '65px' }}>
              <HStack spacing="50px">
                {buttonList.map((type: ButtonType) => {
                  const { Icon, label, onClick } = buttonConfig[type]

                  return (
                    <Popover
                      arrowSize={8}
                      key={type}
                      trigger="hover"
                      placement="top-start"
                      size="md"
                    >
                      <PopoverTrigger>
                        <Box as="button" p="5px" onClick={onClick}>
                          <Image src={Icon} w="28px" h="28px" />
                        </Box>
                      </PopoverTrigger>
                      <PopoverContent width="auto">
                        <PopoverArrow />
                        <PopoverBody
                          whiteSpace="nowrap"
                          fontSize="14px"
                          justifyContent="center"
                        >
                          {label}
                        </PopoverBody>
                      </PopoverContent>
                    </Popover>
                  )
                })}
              </HStack>
            </Center>
          </Box>
          {!isMobile ? EchoBody : null}
        </Box>
      </Flex>
    </PageContainer>
  )
}
