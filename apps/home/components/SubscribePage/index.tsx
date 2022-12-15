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
} from '@chakra-ui/react'
import styled from '@emotion/styled'
import { useMemo, useRef, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Avatar, SubscribeButton } from 'ui'
import { ReactComponent as SvgCopy } from 'assets/subscribe-page/copy-white.svg'
import { ReactComponent as SvgShare } from 'assets/subscribe-page/share-white.svg'
import { ReactComponent as SvgTwitter } from 'assets/subscribe-page/twitter-white.svg'
import { useTranslation } from 'next-i18next'
import { useDidMount, useScreenshot, useToast } from 'hooks'
import { useInfiniteQuery, useQuery } from 'react-query'
import dynamic from 'next/dynamic'
import axios from 'axios'
import { ClusterCommunityResp } from 'models'
import { copyText, shareToTwitter } from 'shared'
import { APP_URL } from '../../constants/env'
import PngDefaultBanner from '../../assets/png/subscribe/bg.png'
import PngEmpty from '../../assets/png/empty.png'
import { useAPI } from '../../api'
import { CommunityCard } from './card'

const Mail3MeButton = dynamic(() => import('./mail3MeButton'), { ssr: false })

const CONTAINER_MAX_WIDTH = 1220

const homeUrl =
  typeof window !== 'undefined' ? `${window?.location?.origin}` : ''

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

interface SubscribePageProps {
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
`

export const getCommunityNfts = (uuid: string) =>
  axios.get<ClusterCommunityResp>(
    `https://openApi.cluster3.net/api/v1/community?uuid=${uuid}`
  )

export const SubscribePage: React.FC<SubscribePageProps> = ({
  mailAddress,
  address,
  uuid,
  priAddress,
}) => {
  const [t] = useTranslation('profile')
  const [t2] = useTranslation('common')
  const toast = useToast()
  const api = useAPI()
  const { downloadScreenshot } = useScreenshot()

  const [isDid, setIsDid] = useState(false)
  const popoverRef = useRef<HTMLElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  const { isOpen, onOpen, onClose } = useDisclosure()

  const shareUrl: string = useMemo(() => `${homeUrl}/s/${address}`, [address])

  const buttonConfig: Record<
    ButtonType,
    {
      Icon: any
      label: string
    }
  > = {
    [ButtonType.Card]: {
      Icon: SvgShare,
      label: t('profile.share'),
    },
    [ButtonType.Copy]: {
      Icon: SvgCopy,
      label: t('profile.copy'),
    },
    [ButtonType.Twitter]: {
      Icon: SvgTwitter,
      label: t('profile.twitter'),
    },
  }

  const actionMap = useMemo(
    () => ({
      [ButtonType.Copy]: async () => {
        await copyText(shareUrl)
        toast(t2('navbar.copied'))
        popoverRef?.current?.blur()
      },
      [ButtonType.Twitter]: () => {
        shareToTwitter({
          text: 'Hey, contact me using my Mail3 email address @mail3dao',
          url: shareUrl,
        })
      },
      [ButtonType.Card]: async () => {
        if (!cardRef?.current) return
        try {
          downloadScreenshot(cardRef.current, 'share.png', {
            ignoreElements: (dom) => {
              if (dom.id === 'screenshot-ignore-element') return true
              return false
            },
          })
        } catch (error) {
          toast('Download screenshot Error!')
        }

        popoverRef?.current?.blur()
      },
    }),
    [mailAddress, address]
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

  const tabList = useMemo(() => {
    if (items && items?.poapList.length > 0) {
      return [TabItemType.Updates, TabItemType.Items]
    }
    return [TabItemType.Updates]
  }, [items])

  const bgImage = useMemo(
    () => settings?.banner_url || PngDefaultBanner.src,
    [settings]
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
            {[ButtonType.Twitter, ButtonType.Copy, ButtonType.Card].map(
              (type: ButtonType) => {
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
              }
            )}
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
          <SubscribeButton
            uuid={uuid}
            host={APP_URL}
            utmSource="subscribe_page"
            utmCampaign={address}
            iframeHeight="46px"
            w="150px"
            h="28px"
            variant="unstyled"
            border="1px solid #000000"
            fontSize="14px"
            bg="#fff"
            color="#000"
            borderRadius="100px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            earnIconStyle={{
              type: 'blue',
              left: '62px',
              top: '-18px',
            }}
          />
        </Box>
        <Text fontWeight="700" fontSize="18px" lineHeight="20px">
          mail3
        </Text>
        <Flex mt={{ base: '4px', md: '8px' }}>
          <Box
            display="inline-block"
            p="4px 4px 4px 8px"
            background="#F0F0F0"
            borderRadius="100px"
          >
            <Text fontWeight="400" fontSize="16px" lineHeight="24px">
              {mailAddress}
              {settings?.mmb_state === 'enabled' ? (
                <Mail3MeButton to={mailAddress} />
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
      <Tabs position="relative" mt="30px" p={{ base: '0', md: '0px 58px' }}>
        <TabList
          className="tablist"
          w={{ base: '100%', md: 'auto' }}
          overflowX="scroll"
          overflowY="hidden"
          justifyContent="flex-start"
          border="none"
          position="relative"
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
          p={{ base: '10px', md: '20px 0px' }}
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
                      <Image mt="20px" src={PngEmpty.src} w="106px" />
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
              <Wrap spacing={{ base: '15px', md: '26px' }}>
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
    </PageContainer>
  )
}
