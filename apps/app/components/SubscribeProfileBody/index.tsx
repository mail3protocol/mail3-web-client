import {
  Box,
  Center,
  Flex,
  Image,
  Text,
  Collapse,
  useDisclosure,
  Button as RawButton,
  Tabs,
  TabList,
  HStack,
  Tab,
  TabPanels,
  TabPanel,
  SimpleGrid,
  Wrap,
  WrapItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  Spinner,
  Spacer,
  Link,
  useBreakpointValue,
  AspectRatio,
} from '@chakra-ui/react'
import styled from '@emotion/styled'
import { useMemo, useRef, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Avatar, SubscribeCard } from 'ui'
import SvgCopy from 'assets/subscribe-page/copy.svg'
import SvgTwitter from 'assets/subscription/twitter.svg'
import SvgDownload from 'assets/subscribe-page/download.svg'
import { ReactComponent as SvgPremium } from 'assets/subscribe-page/star.svg'
import { useDidMount, useScreenshot, useToast } from 'hooks'
import { useInfiniteQuery, useQuery } from 'react-query'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { ClusterCommunityResp } from 'models'
import {
  copyText,
  isEthAddress,
  isPrimitiveEthAddress,
  isVerifyOverflow,
  shareToTwitter,
  truncateMiddle,
} from 'shared'
import { APP_URL } from '../../constants/env'

import PngEmpty from '../../assets/subscribeProfile/empty.png'
import PngCluster3 from '../../assets/subscribeProfile/cluster3.png'

import { CommunityCard } from './card'
import { useAPI } from '../../hooks/useAPI'

import { useAuth, useIsAuthenticated } from '../../hooks/useLogin'
import { UserSettingResponse } from '../../api'
import { MAIL_SERVER_URL } from '../../constants'
import { SubscribeButtonInApp } from '../SubscribeButtonInApp'
import { Query } from '../../api/query'

const CONTAINER_MAX_WIDTH = 1096

const homeUrl = typeof window !== 'undefined' ? window.location.origin : APP_URL

enum ButtonType {
  Copy,
  Card,
  Twitter,
}

enum TabItemType {
  Updates,
  Items,
}

const tabsConfig: Record<
  TabItemType,
  {
    name: string
  }
> = {
  [TabItemType.Updates]: {
    name: 'Updates',
  },
  [TabItemType.Items]: {
    name: 'Items',
  },
}

export interface SubscribeProfileDataProps {
  userInfo: { nickname: string; avatar: string }
  userSettings: UserSettingResponse
  uuid: string
  priAddress: string
  address: string
}

interface SubscribeProfileBodyProps extends SubscribeProfileDataProps {
  // mailAddress: string
}

const PageContainer = styled(Box)`
  max-width: ${CONTAINER_MAX_WIDTH}px;
  margin: 0px auto;
  background-color: #ffffff;
  min-height: 800px;

  @media (max-width: 600px) {
    border: none;
    width: 100%;
    height: auto;
    padding: 0;
    box-shadow: none;
    margin: 0;
  }

  .tablist {
    &::-webkit-scrollbar {
      width: 0 !important;
      height: 0 !important;
      display: none;
    }
  }
`

export const getCommunityNfts = (uuid: string) =>
  axios.get<ClusterCommunityResp>(
    `https://openApi.cluster3.net/api/v1/community?uuid=${uuid}`
  )

export const SubscribeProfileBody: React.FC<SubscribeProfileBodyProps> = ({
  uuid,
  priAddress,
  userInfo,
  userSettings,
  address,
}) => {
  const mailAddress = `${address}@${MAIL_SERVER_URL}`
  const [t] = useTranslation(['subscribe-profile', 'common'])
  useAuth(true)
  const isAuth = useIsAuthenticated()
  const toast = useToast()
  const api = useAPI()
  const isMobile = useBreakpointValue({ base: true, md: false })
  const { downloadScreenshot } = useScreenshot()

  const [isDid, setIsDid] = useState(false)
  const popoverRef = useRef<HTMLElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const descRef = useRef<HTMLDivElement>(null)

  const { isOpen, onOpen, onClose } = useDisclosure()

  const shareUrl: string = useMemo(() => `${homeUrl}/${address}`, [address])

  const buttonConfig: Record<
    ButtonType,
    {
      Icon: any
      label: string
    }
  > = {
    [ButtonType.Card]: {
      Icon: SvgDownload,
      label: t('share'),
    },
    [ButtonType.Copy]: {
      Icon: SvgCopy,
      label: t('copy'),
    },
    [ButtonType.Twitter]: {
      Icon: SvgTwitter,
      label: t('twitter'),
    },
  }

  const actionMap = useMemo(
    () => ({
      [ButtonType.Copy]: async () => {
        await copyText(shareUrl)
        toast(t('navbar.copied', { ns: 'common' }))
        popoverRef?.current?.blur()
      },
      [ButtonType.Twitter]: () => {
        shareToTwitter({
          text: 'Hey, visit my Subscription Page to view my latest content @mail3dao',
          url: shareUrl,
        })
      },
      [ButtonType.Card]: async () => {
        if (!cardRef?.current) return
        try {
          downloadScreenshot(cardRef.current, 'share.png', {
            width: 1005,
            height: cardRef.current.offsetHeight,
            scale: 1,
          })
        } catch (error) {
          toast('Download screenshot Error!')
        }

        popoverRef?.current?.blur()
      },
    }),
    [mailAddress, address]
  )

  const { data: info } = useQuery(
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
      initialData: userInfo,
    }
  )

  const { data: settings, isLoading } = useQuery(
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
      initialData: userSettings,
    }
  )

  const { data: isPremiumMember } = useQuery(
    [Query.GetCheckPremiumMember, priAddress],
    async () => {
      try {
        await api.checkPremiumMember(uuid)
        return true
      } catch (error) {
        return false
      }
    },
    {
      retry: 0,
      enabled: isAuth,
      refetchOnMount: true,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  )

  const communityId: string | undefined = useMemo(() => {
    if (settings?.items_link) {
      const itemsId = settings.items_link.match(/community\/(\d+)$/)
      if (itemsId && itemsId.length > 1) {
        return itemsId[1]
      }
    }
    return undefined
  }, [settings])

  const { data: items } = useQuery(
    ['communityNfts'],
    async () => {
      const ret = await getCommunityNfts(communityId!)
      return ret.data.data
    },
    {
      refetchIntervalInBackground: false,
      refetchOnMount: true,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      enabled: !!communityId,
    }
  )

  const {
    data,
    isLoading: isLoadingCommunityMsg,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    ['CommunityMessageList', priAddress],
    async ({ pageParam = '' }) => {
      const ret = await api.getCommunityMessages(priAddress, pageParam)
      return ret.data
    },
    {
      getNextPageParam: (lastPage) => {
        if (lastPage.next_cursor) {
          return lastPage.next_cursor
        }
        return undefined
      },
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    }
  )

  const nickname = useMemo(() => {
    if (info?.nickname) {
      return info.nickname
    }
    if (isPrimitiveEthAddress(address)) {
      return truncateMiddle(address, 6, 4, '_')
    }
    if (isEthAddress(address)) {
      return address.includes('.') ? address.split('.')[0] : address
    }
    return ''
  }, [info])

  const tabList = useMemo(() => {
    if (items && items?.poapList.length > 0) {
      return [TabItemType.Updates, TabItemType.Items]
    }
    return [TabItemType.Updates]
  }, [items])

  const bgImage = useMemo(
    () => (isLoading ? '' : settings?.banner_url),
    [settings, isLoading]
  )

  const communityList = useMemo(
    () =>
      data?.pages
        .map((item) => item.messages)
        .filter((item) => item?.length)
        .flat() || [],
    [data]
  )

  const desc = useMemo(
    () =>
      settings?.description
        ? settings?.description
        : t('description_placeholder'),
    [settings?.description]
  )

  const isShowMore = useMemo(
    () =>
      isVerifyOverflow({
        str: desc,
        fontSize: '12px',
        height: '20',
        width: `${descRef.current?.offsetWidth || 560}px`,
        lineHeight: '20px',
      }),
    [desc, descRef.current]
  )

  useDidMount(() => {
    setIsDid(true)
  })

  const buttonList = useMemo(() => {
    if (isMobile) return [ButtonType.Twitter, ButtonType.Copy]
    return [ButtonType.Twitter, ButtonType.Copy, ButtonType.Card]
  }, [isMobile])

  if (!isDid) return null

  return (
    <>
      <Box
        position="relative"
        minH={{ base: '100px', xl: '200px' }}
        w={{ base: '100%', xl: CONTAINER_MAX_WIDTH }}
        margin="0 auto"
        overflow="hidden"
      >
        <AspectRatio
          ratio={CONTAINER_MAX_WIDTH / 200}
          minH={{ base: '100px', xl: '200px' }}
        >
          <Box
            w="full"
            h="full"
            bgImage={bgImage}
            bgRepeat="no-repeat"
            bgSize={{ base: 'auto 100%', md: '100%' }}
            bgPosition="center"
            position="relative"
            overflow="hidden"
          />
        </AspectRatio>

        <Center
          position="absolute"
          w="full"
          h="full"
          zIndex={2}
          bottom={{ base: 0, md: '-30px' }}
          left="0"
          p={{ base: '20px', md: '24px' }}
        >
          <Box
            flexGrow={0}
            flexShrink={0}
            w={{ base: '60px', md: '116px' }}
            h={{ base: '60px', md: '116px' }}
            border="1px solid #E7E7E7"
            bgColor="#fff"
            borderRadius="50%"
            overflow="hidden"
          >
            <Avatar
              src={userInfo.avatar}
              address={priAddress}
              w="100%"
              h="100%"
            />
          </Box>
          <Box ml="16px">
            <Text
              fontWeight="700"
              fontSize={{ base: '12px', md: '24px' }}
              lineHeight={{ base: '12px', md: '24px' }}
              noOfLines={1}
            >
              {nickname}
            </Text>
            {isPremiumMember ? (
              <Center
                mt="8px"
                w={{ base: '24px', md: '140px' }}
                h="24px"
                background="#FFA800"
                borderRadius="100px"
              >
                <SvgPremium />
                <Box
                  ml="4px"
                  fontStyle="italic"
                  fontWeight="500"
                  fontSize="12px"
                  lineHeight="16px"
                  color="#fff"
                  display={{ base: 'none', md: 'block' }}
                >
                  {t('premium-member')}
                </Box>
              </Center>
            ) : null}
          </Box>

          <Spacer />
          <SubscribeButtonInApp
            uuid={uuid}
            rewardType={settings?.reward_type}
            isAuth={isAuth}
            ml={{ base: 0, md: '6px' }}
            fontSize="0"
          />
        </Center>
      </Box>

      <PageContainer className="family-to-read">
        <Box
          p={{ base: '8px 20px 34px', md: '24px 30px 0' }}
          position="relative"
        >
          {desc ? (
            <Box ref={descRef} w="100%">
              <Collapse startingHeight={isMobile ? 40 : 20} in={isOpen}>
                <Text
                  fontWeight="400"
                  fontSize={{ base: '12px', md: '14px' }}
                  lineHeight="20px"
                  whiteSpace="pre-line"
                  color="#737373"
                >
                  {desc}
                </Text>
              </Collapse>
              {isShowMore ? (
                <Flex justifyContent="flex-start" mt="8px">
                  <RawButton
                    size="xs"
                    onClick={() => {
                      if (isOpen) {
                        onClose()
                      } else {
                        onOpen()
                      }
                    }}
                    variant="link"
                    color="black"
                    fontWeight="400"
                    fontSize="12px"
                    lineHeight="20px"
                    textDecoration="underline"
                  >
                    Show {isOpen ? 'Less' : 'More'}
                  </RawButton>
                </Flex>
              ) : null}
            </Box>
          ) : null}

          {!isMobile ? (
            <Center justifyContent="flex-end" mt="20px">
              <HStack spacing="15px">
                {buttonList.map((type: ButtonType) => {
                  const { Icon: IconSvg, label } = buttonConfig[type]
                  const onClick = actionMap[type]
                  return (
                    <Popover
                      arrowSize={8}
                      key={type}
                      trigger="hover"
                      placement="top-start"
                    >
                      <PopoverTrigger>
                        <Box
                          as="button"
                          p="5px"
                          lineHeight={0}
                          onClick={onClick}
                          role="option"
                          aria-label={label}
                        >
                          <Image
                            src={IconSvg}
                            w={{ base: '16px', md: '24px' }}
                            h={{ base: '16px', md: '24px' }}
                          />
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
          ) : null}
        </Box>
        <Tabs
          position="relative"
          mt={{ base: '0', md: '30px' }}
          p={{ base: '0px', md: '0px 30px' }}
        >
          <TabList
            className="tablist"
            w={{ base: '100%', md: 'auto' }}
            overflowX="scroll"
            overflowY="hidden"
            justifyContent="flex-start"
            border="none"
            position="relative"
            px={{ base: '20px', md: 0 }}
          >
            <Box
              w="100%"
              bottom="0"
              left="0"
              position="absolute"
              zIndex="1"
              bg="#F3F3F3"
              h="1px"
            />
            <HStack
              spacing={{ base: '20px', md: '50px' }}
              position="relative"
              zIndex="2"
            >
              {tabList.map((type) => {
                const { name } = tabsConfig[type]
                return (
                  <Tab
                    key={type}
                    _selected={{
                      fontWeight: 600,
                      _before: {
                        content: '""',
                        position: 'absolute',
                        w: '100%',
                        h: '4px',
                        bottom: '-1px',
                        bg: '#000',
                        borderRadius: '4px',
                      },
                    }}
                    position="relative"
                    p={{ base: '0 0 3px 0', md: '0 0 8px 0' }}
                  >
                    <HStack>
                      <Box
                        whiteSpace="nowrap"
                        fontSize={{ base: '14px', md: '18px' }}
                        marginInlineStart="0px !important"
                      >
                        {name}
                      </Box>
                    </HStack>
                  </Tab>
                )
              })}
            </HStack>
          </TabList>

          <Flex
            justifyContent="center"
            p={{ base: '12px', md: '20px 0px' }}
            minH="200px"
          >
            <TabPanels>
              <TabPanel p="0">
                {!communityList.length ? (
                  <Center
                    h="200px"
                    alignContent="center"
                    flexDirection="column"
                  >
                    {isLoadingCommunityMsg ? (
                      <Spinner />
                    ) : (
                      <>
                        <Image mt="20px" src={PngEmpty} w="106px" />
                        <Text
                          fontWeight="300"
                          fontSize="18px"
                          lineHeight="48px"
                          color="#B3B3B3"
                        >
                          There are no updates on this page
                        </Text>
                      </>
                    )}
                  </Center>
                ) : (
                  <InfiniteScroll
                    dataLength={communityList.length}
                    next={fetchNextPage}
                    hasMore={hasNextPage === true}
                    loader={
                      <Center h="50px">
                        <Spinner />
                      </Center>
                    }
                  >
                    <SimpleGrid
                      columns={{ base: 1, md: 4 }}
                      spacing={{ base: '0', md: '20px' }}
                    >
                      {communityList.map((item) => {
                        const {
                          uuid: id,
                          subject,
                          summary,
                          created_at: date,
                          message_type: type,
                        } = item
                        return (
                          <CommunityCard
                            type={type}
                            key={id}
                            uuid={id}
                            title={subject}
                            content={summary}
                            date={date}
                          />
                        )
                      })}
                    </SimpleGrid>
                  </InfiniteScroll>
                )}
              </TabPanel>
              <TabPanel p="0">
                <Center pb="17px">
                  <Text fontWeight="500" fontSize="12px" lineHeight="24px">
                    {items?.poapList?.length} items
                  </Text>
                  <Spacer />
                  <Flex fontWeight="400" fontSize="12px" lineHeight="24px">
                    Data source:
                    <Link href={settings?.items_link} target="_blank">
                      <Image w="100px" ml="10px" src={PngCluster3} />
                    </Link>
                  </Flex>
                </Center>
                <Wrap spacing={{ base: '15px', md: '28px' }}>
                  {items?.poapList.map((item) => {
                    const { name, img, poapPlatform } = item
                    return (
                      <WrapItem
                        key={item.name}
                        w="160px"
                        cursor="pointer"
                        as="a"
                        href={poapPlatform}
                        target="_blank"
                        border="1px solid #E1E1E1"
                        borderRadius="8px"
                      >
                        <Center flexDirection="column" w="100%">
                          <Center
                            w="100%"
                            position="relative"
                            overflow="hidden"
                          >
                            <Box
                              position="absolute"
                              filter="blur(50px)"
                              top="0"
                              left="0"
                              w="100%"
                              h="100%"
                              zIndex="1"
                            >
                              <Image
                                src={img}
                                objectFit="cover"
                                transform="scale(1.1)"
                              />
                            </Box>
                            <Flex
                              m="8px 0 10px 0"
                              w="79px"
                              h="114px"
                              overflow="hidden"
                              alignItems="center"
                              position="relative"
                              zIndex="2"
                            >
                              <Image src={img} w="100%" />
                            </Flex>
                          </Center>
                          <Box p="10px 10px 20px 10px">
                            <Text
                              w="100%"
                              fontSize="12px"
                              textAlign="center"
                              lineHeight="16px"
                              noOfLines={2}
                              color="#000"
                              fontWeight="500"
                            >
                              {name}
                            </Text>
                          </Box>
                        </Center>
                      </WrapItem>
                    )
                  })}
                </Wrap>
              </TabPanel>
            </TabPanels>
          </Flex>
        </Tabs>

        <SubscribeCard
          // isDev
          bannerUrl={bgImage}
          qrUrl={`${APP_URL}/${address}`}
          mailAddress={mailAddress}
          desc={desc}
          ref={cardRef}
          nickname={nickname}
        />
      </PageContainer>
    </>
  )
}
