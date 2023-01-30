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
} from '@chakra-ui/react'
import styled from '@emotion/styled'
import { useMemo, useRef, useState, ComponentType } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Avatar, SubscribeCard } from 'ui'
import dynamic from 'next/dynamic'
import { ReactComponent as SvgCopy } from 'assets/subscribe-page/copy-white.svg'
import { ReactComponent as SvgShare } from 'assets/subscribe-page/share-white.svg'
import { ReactComponent as SvgTwitter } from 'assets/subscribe-page/twitter-white.svg'
import { useDidMount, useScreenshot, useToast } from 'hooks'
import { useInfiniteQuery, useQuery } from 'react-query'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { ClusterCommunityResp } from 'models'
import {
  copyText,
  isEthAddress,
  isPrimitiveEthAddress,
  shareToTwitter,
  truncateMiddle,
} from 'shared'
import { APP_URL, HOME_URL } from '../../constants/env'
import PngDefaultBanner from '../../assets/subscribeProfile/bg.png'
import PngMailMeButton from '../../assets/subscribeProfile/mail-me-button.png'
import PngEmpty from '../../assets/subscribeProfile/empty.png'
import PngCluster3 from '../../assets/subscribeProfile/cluster3.png'

import { CommunityCard } from './card'
import { useAPI } from '../../hooks/useAPI'

import { useAuth } from '../../hooks/useLogin'

import type { SubscribeButtonProps } from '../SubscriptionArticleBody/subscribeButton'

const LazyloadSubscribeButton: ComponentType<SubscribeButtonProps> = dynamic(
  () => import('../SubscriptionArticleBody/subscribeButton') as any,
  {
    ssr: false,
    suspense: false,
    loading: () => null,
  }
)

const CONTAINER_MAX_WIDTH = 1220

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

interface SubscribeProfileBodyProps {
  mailAddress: string
  address: string
  uuid: string
  priAddress: string
}

const PageContainer = styled(Box)`
  max-width: ${CONTAINER_MAX_WIDTH}px;
  margin: 20px auto;
  background-color: #ffffff;
  box-shadow: 0px 0px 24px rgba(0, 0, 0, 0.25);
  border-radius: 24px;
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
  mailAddress,
  address,
  uuid,
  priAddress,
}) => {
  const [t] = useTranslation(['subscribe-profile', 'common'])
  useAuth(true)
  const toast = useToast()
  const api = useAPI()
  const isMobile = useBreakpointValue({ base: true, md: false })
  const { downloadScreenshot } = useScreenshot()

  const [isDid, setIsDid] = useState(false)
  const popoverRef = useRef<HTMLElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

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
      Icon: SvgShare,
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
            width: 335,
            height: 535,
            scale: 2,
          })
        } catch (error) {
          toast('Download screenshot Error!')
        }

        popoverRef?.current?.blur()
      },
    }),
    [mailAddress, address]
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

  const tabList = useMemo(() => {
    if (items && items?.poapList.length > 0) {
      return [TabItemType.Updates, TabItemType.Items]
    }
    return [TabItemType.Updates]
  }, [items])

  const bgImage = useMemo(
    () => (isLoading ? '' : settings?.banner_url || PngDefaultBanner),
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

  useDidMount(() => {
    setIsDid(true)
  })

  const buttonList = useMemo(() => {
    if (isMobile) return [ButtonType.Twitter, ButtonType.Copy]
    return [ButtonType.Twitter, ButtonType.Copy, ButtonType.Card]
  }, [isMobile])

  if (!isDid) return null

  return (
    <PageContainer>
      <Box
        h={{ base: '100px', md: '200px' }}
        bgImage={bgImage}
        bgRepeat="no-repeat"
        bgSize="auto 100%"
        bgPosition="center"
        position="relative"
        overflow="hidden"
        borderTopLeftRadius={{ base: 0, md: '25px' }}
        borderTopRightRadius={{ base: 0, md: '25px' }}
      >
        <Box
          top={{ base: '10px', md: '32px' }}
          right={{ base: '10px', md: '32px' }}
          position="absolute"
          bgColor="rgba(0, 0, 0, 0.4)"
          backdropFilter="blur(5px)"
          borderRadius="100px"
        >
          <HStack>
            {buttonList.map((type: ButtonType) => {
              const { Icon, label } = buttonConfig[type]
              const onClick = actionMap[type]
              return (
                <Popover
                  arrowSize={8}
                  key={type}
                  trigger="hover"
                  placement="top-start"
                  size="md"
                >
                  <PopoverTrigger>
                    <Box as="button" p="10px" onClick={onClick}>
                      <Icon />
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
        </Box>
      </Box>

      <Box p={{ base: '48px 20px', md: '70px 60px 0' }} position="relative">
        <Box
          w={{ base: '60px', md: '120px' }}
          h={{ base: '60px', md: '120px' }}
          left={{ base: '20px', md: '60px' }}
          top={{ base: '-30px', md: '-60px' }}
          position="absolute"
          boxShadow="0px 0px 8px rgba(0, 0, 0, 0.25)"
          bgColor="#fff"
          borderRadius="50%"
          overflow="hidden"
        >
          <Avatar address={priAddress} w="100%" h="100%" />
        </Box>
        <Box
          position="absolute"
          top={{ base: 'auto', md: '26px' }}
          right={{ base: '50%', md: '54px' }}
          bottom={{ base: '0px', md: 'auto' }}
          transform={{ base: 'translateX(50%)', md: 'none' }}
        >
          <LazyloadSubscribeButton
            uuid={uuid}
            rewardType={settings?.reward_type}
          />
        </Box>
        <Text fontWeight="700" fontSize="18px" lineHeight="20px">
          {nickname}
        </Text>
        <Flex mt={{ base: '4px', md: '8px' }}>
          <Box
            display="inline-block"
            p="4px 4px 4px 8px"
            background="#F0F0F0"
            borderRadius="100px"
            maxW="100%"
          >
            <Text
              fontWeight="400"
              fontSize={{ base: '14px', md: '16px' }}
              lineHeight="24px"
            >
              {mailAddress}
              {settings?.mmb_state === 'enabled' ? (
                <Box
                  ml="10px"
                  as="a"
                  display="inline-block"
                  verticalAlign="middle"
                  target="_blank"
                  href={`${APP_URL}/message/edit?utm_source=${HOME_URL}&utm_medium=click_mail_me_button&to=${mailAddress}`}
                  w={{ base: '24px', md: '36px' }}
                  h={{ base: '24px', md: '36px' }}
                >
                  <Image src={PngMailMeButton} w="100%" h="100%" />
                </Box>
              ) : null}
            </Text>
          </Box>
        </Flex>
        {settings?.description ? (
          <Box mt="8px" w={{ base: '100%', md: '560px' }}>
            <Collapse startingHeight={20} in={isOpen}>
              <Text fontWeight="400" fontSize="12px" lineHeight="20px">
                {settings?.description}
              </Text>
            </Collapse>
            {settings?.description.length > 85 ? (
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
              >
                Show {isOpen ? 'Less' : 'More'}
              </RawButton>
            ) : null}
          </Box>
        ) : null}
      </Box>
      <Tabs position="relative" mt="30px" p={{ base: '0px', md: '0px 58px' }}>
        <TabList
          className="tablist"
          w={{ base: '100%', md: 'auto' }}
          overflowX="scroll"
          overflowY="hidden"
          justifyContent="flex-start"
          border="none"
          position="relative"
          px={{ base: '10px', md: 0 }}
        >
          <Box
            w="100%"
            bottom="0"
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
                      w: '50px',
                      h: '4px',
                      bottom: '-1px',
                      bg: '#000',
                      borderRadius: '4px',
                    },
                  }}
                  position="relative"
                  p={{ base: '5px', md: 'auto' }}
                >
                  <HStack>
                    <Box
                      whiteSpace="nowrap"
                      fontSize={{ base: '14px', md: '18px' }}
                      marginInlineStart={{
                        base: '5px !important',
                        md: '0px !important',
                      }}
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
          p={{ base: '20px', md: '20px 0px' }}
          minH="200px"
        >
          <TabPanels>
            <TabPanel p="0">
              {!communityList.length ? (
                <Center h="200px" alignContent="center" flexDirection="column">
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
                    columns={{ base: 1, md: 3 }}
                    spacing={{ base: '0', md: '20px' }}
                  >
                    {communityList.map((item) => {
                      const {
                        uuid: id,
                        subject,
                        summary,
                        created_at: date,
                      } = item
                      return (
                        <CommunityCard
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
                        <Center w="100%" position="relative" overflow="hidden">
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
        desc={settings?.description}
        ref={cardRef}
        nickname={nickname}
      />
    </PageContainer>
  )
}
