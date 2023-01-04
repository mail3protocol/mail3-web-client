import {
  Box,
  Center,
  Flex,
  HStack,
  Image,
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
import { isEthAddress, isPrimitiveEthAddress, truncateMiddle } from 'shared'
import { Subscription } from 'models'
import SvgCopy from 'assets/subscription/copy.svg'
import SvgTelegram from 'assets/subscription/telegram.svg'
import SvgTwitter from 'assets/subscription/twitter.svg'
import { EchoIframe } from 'ui'
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
  margin: 20px auto;
  min-height: 800px;
  background-color: #ffffff;

  @media (max-width: 600px) {
  }
`

enum ButtonType {
  Copy,
  Telegram,
  Twitter,
}

export const SubscriptionArticleBody: React.FC<
  SubscriptionArticleBodyProps
> = ({ mailAddress, address, priAddress, articleId, detail }) => {
  const [t] = useTranslation(['subscribe-profile', 'common'])
  const toast = useToast()
  const api = useAPI()
  const isMobile = useBreakpointValue({ base: true, md: false })
  const shareUrl: string = useMemo(
    () => `${APP_URL}/p/${articleId}`,
    [articleId]
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
      label: t('share'),
      onClick: () => {},
    },
    [ButtonType.Copy]: {
      Icon: SvgCopy,
      label: t('copy'),
      onClick: () => {},
    },
    [ButtonType.Twitter]: {
      Icon: SvgTwitter,
      label: t('twitter'),
      onClick: () => {},
    },
  }
  const buttonList = [ButtonType.Telegram, ButtonType.Copy, ButtonType.Twitter]
  console.log(userInfo, settings, nickname)

  return (
    <PageContainer>
      <Flex>
        <UserInfo
          priAddress={priAddress}
          nickname={nickname}
          mailAddress={mailAddress}
          desc={settings?.description}
        />
        <Box minH="500px" p="48px 32px" w="71.33%">
          <Text fontWeight="700" fontSize="32px" lineHeight="1.3">
            The More Important the Work, the More Important the Rest
          </Text>

          <Flex m="23px 0">
            <Box fontWeight={500} fontSize="12px" color="#6F6F6F" mt="4px">
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
                        <Image src={Icon} w="21px" h="21px" />
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

          <Box
            background="#EBEBEB"
            borderRadius="12px"
            p="16px"
            overflow="hidden"
          >
            <Text
              fontWeight="500"
              fontSize="16px"
              lineHeight="24px"
              color="#333333"
              noOfLines={2}
            >
              Just click The “Delivering to...” button under their name. If you
              change the destination, all existing and future email will be
              moved automatically.all existing and future email will be moved
              automatically.
            </Text>
          </Box>

          <Box pt={{ base: '16px', md: '30px' }}>
            <RenderHTML
              html={detail?.content}
              shadowStyle={`main { min-height: 400px; } img[style="max-width: 100%;"] { height: auto }`}
            />
            <EchoIframe
              targetUri={`${APP_URL}/${RoutePath.Subscription}/${articleId}`}
              mailAddress={mailAddress}
            />
          </Box>
        </Box>
      </Flex>
    </PageContainer>
  )
}
