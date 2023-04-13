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
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Wrap,
  WrapItem,
} from '@chakra-ui/react'
import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { Avatar, ProfileCardHome, SubscribeButton } from 'ui'
import { useMemo, useRef, useState } from 'react'
import {
  TrackEvent,
  useDidMount,
  useScreenshot,
  useToast,
  useTrackClick,
} from 'hooks'
import {
  copyText,
  isZilpayAddress,
  isBitDomain,
  shareToTwitter,
  isEnsDomain,
  isPrimitiveEthAddress,
  truncateMiddle,
  isEthAddress,
} from 'shared'
import dynamic from 'next/dynamic'
import { useQuery } from 'react-query'
import { ReactComponent as SvgCopy } from 'assets/profile/copy.svg'
import { ReactComponent as SvgShare } from 'assets/profile/share.svg'
import { ReactComponent as SvgTwitter } from 'assets/profile/twitter.svg'
import axios from 'axios'
import { ClusterInfoResp } from 'models'
import { useRootURL } from 'app/hooks/useRootURL'
import { ReactComponent as SvgRank } from '../../assets/svg/rank.svg'
import { ReactComponent as SvgCollect } from '../../assets/svg/collect.svg'
import PngCluster3 from '../../assets/png/cluster3.png'
import PngEmpty from '../../assets/png/empty.png'
import { APP_URL } from '../../constants/env'
import { useAPI } from '../../api'

const Mail3MeButton = dynamic(() => import('./mail3MeButton'), { ssr: false })

enum ButtonType {
  Copy,
  Card,
  Twitter,
}

const Container = styled(Box)`
  background: #ffffff;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.15);
  border-radius: 24px;
  max-width: 1220px;
  width: 100%;
  margin: 0 auto;
  height: calc(100vh - 106px);

  @media (max-width: 600px) {
    box-shadow: none;
    height: auto;
  }
`

const WrapMain = styled(Center)`
  height: 100%;
  width: 100%;
  margin: 0 auto;
  max-width: 1000px;
  position: relative;
  align-items: flex-start;

  .tablist {
    &::-webkit-scrollbar {
      width: 0 !important;
      height: 0 !important;
      display: none;
    }
  }

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: center;

    .btn-wrap {
      display: flex;
      width: 100%;
      margin-top: 8px;
      justify-content: space-evenly;
    }
  }
`

const WrapLeft = styled(Center)`
  width: 228px;
  position: relative;
  margin-top: 40px;
  padding: 60px 20px 55px 20px;
  background-color: #ffffff;
  border: 1px solid #e7e7e7;
  border-radius: 24px;
  height: calc(100vh - 202px);
  flex-direction: column;
  justify-content: flex-start;

  .avatar {
  }

  .address {
    background: #f3f3f3;
    border-radius: 16px;
    padding: 4px 8px;
    margin-top: 5px;
    text-align: center;
    width: 180px;

    .p {
      font-style: normal;
      font-weight: 500;
      font-size: 12px;
      line-height: 20px;
    }
  }

  @media (max-width: 600px) {
    border: none;
    width: 100%;
    height: auto;
    padding: 0;

    .address {
      margin-top: 0;
    }
  }
`

const WrapRight = styled(Box)`
  width: 100%;
  padding: 40px;

  .nft-list-wrap {
    height: calc(100vh - 406px);

    &::-webkit-scrollbar {
      width: 0 !important;
      height: 0 !important;
      display: none;
    }
  }

  @media (max-width: 600px) {
    padding: 10px;

    .nft-list-wrap {
      height: auto;
    }
  }
`

interface ProfileComponentProps {
  mailAddress: string
  address: string
  uuid: string
  priAddress: string
}

enum TabItemType {
  Collection = 0,
  Updates = 1,
}

const tabsConfig: Record<
  TabItemType,
  {
    name: string
  }
> = {
  [TabItemType.Collection]: {
    name: 'Collection',
  },
  [TabItemType.Updates]: {
    name: 'Updates',
  },
}

export const getNfts = (address: string) =>
  axios.get<ClusterInfoResp>(
    `https://openApi.cluster3.net/api/v1/communityUserInfo?uuid=b45339c7&address=${address}`
  )

export const ProfileComponent: React.FC<ProfileComponentProps> = ({
  mailAddress,
  address,
  uuid,
  priAddress,
}) => {
  const [t] = useTranslation('profile')
  const [t2] = useTranslation('common')

  const trackTwitter = useTrackClick(TrackEvent.ClickProfileTwitter)
  const trackCopy = useTrackClick(TrackEvent.ClickProfileCopy)
  const trackCard = useTrackClick(TrackEvent.ClickProfileDownloadCard)

  const api = useAPI()
  const toast = useToast()
  const { downloadScreenshot } = useScreenshot(false)

  const [isDid, setIsDid] = useState(false)
  const popoverRef = useRef<HTMLElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  const { data: clusterInfo, isLoading } = useQuery(
    ['cluster', priAddress],
    async () => {
      const ret = await getNfts(priAddress)
      return ret.data.data
    },
    {
      refetchIntervalInBackground: false,
      refetchOnMount: true,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  )

  const { data: userInfo } = useQuery(
    ['userInfo', priAddress],
    async () => {
      const info = await api.getUserInfo(priAddress)
      const setting = await api.getUserSetting(priAddress)
      return {
        info: info.data,
        settings: setting.data,
      }
    },
    {
      refetchIntervalInBackground: false,
      refetchOnMount: true,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  )

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

  const tabItemTypes = [TabItemType.Collection, TabItemType.Updates]

  const rootURL = useRootURL()
  const profileUrl = `${rootURL}/${address}`

  const hashTag = useMemo(() => {
    if (isZilpayAddress(address)) return 'Zilliqa'
    if (isBitDomain(address)) return 'DOTBIT'
    if (isEnsDomain(address)) return 'ENS'
    return ''
  }, [address])

  const actionMap = useMemo(
    () => ({
      [ButtonType.Copy]: async () => {
        trackCopy()
        await copyText(profileUrl)
        toast(t2('navbar.copied'))
        popoverRef?.current?.blur()
      },
      [ButtonType.Twitter]: () => {
        trackTwitter()
        shareToTwitter({
          text: 'Hey, contact me using my Mail3 email address @mail3dao',
          url: profileUrl,
          hashtags: hashTag ? ['web3', 'mail3', hashTag] : ['web3', 'mail3'],
        })
      },
      [ButtonType.Card]: async () => {
        trackCard()
        if (!cardRef?.current) return
        try {
          downloadScreenshot(cardRef.current, 'share.png', {
            ignoreElements: (dom) => {
              if (dom.id === 'mail3-me-button-wrap') return true
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

  const nickname = useMemo(() => {
    if (userInfo?.info?.nickname) {
      return userInfo.info?.nickname
    }
    if (isPrimitiveEthAddress(address)) {
      return truncateMiddle(address, 6, 4, '_')
    }
    if (isEthAddress(address)) {
      return address.includes('.') ? address.split('.')[0] : address
    }
    return ''
  }, [userInfo])

  useDidMount(() => {
    setIsDid(true)
  })

  if (!isDid) return null

  const poapList = clusterInfo?.poapList ?? []
  const hadLength = poapList.filter((item) => item.hadGot).length ?? 0
  const allLength = poapList.length ?? 0

  return (
    <>
      <Container>
        <WrapMain>
          <WrapLeft>
            <Box className="avatar">
              <Avatar
                address={priAddress}
                borderRadius="50%"
                w="64px"
                h="64px"
              />
            </Box>
            <Center fontWeight="700" fontSize="14px" lineHeight="26px" w="full">
              <Text>{nickname}</Text>
            </Center>
            <Box className="address">
              <Text className="p">{mailAddress}</Text>
            </Box>

            <Box className="btn-wrap">
              {uuid ? (
                <Box mt={{ base: '10px', md: '25px' }}>
                  <SubscribeButton
                    uuid={uuid}
                    host={APP_URL}
                    utmSource={location.host}
                    utmCampaign={address}
                    variant="unstyled"
                    iframeHeight="30px"
                    w="150px"
                    h="30px"
                    fontSize="14px"
                    borderRadius="100px"
                    rewardType={userInfo?.settings.reward_type}
                    pl="5px"
                    color="#fff"
                    bg="#000"
                    earnIconStyle={{
                      w: '70px',
                    }}
                  />
                </Box>
              ) : null}
              <Center mt={{ base: '10px', md: '25px' }}>
                <Mail3MeButton to={mailAddress} />
              </Center>
            </Box>

            <Box mt={{ base: '10px', md: '25px' }}>
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
          </WrapLeft>

          <WrapRight>
            <Tabs position="relative">
              <TabList
                className="tablist"
                w={{ base: '100%', md: 'auto' }}
                overflowX="scroll"
                overflowY="hidden"
                justifyContent={{ base: 'flex-start', md: 'space-around' }}
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
                  spacing={{ base: 0, md: '50px' }}
                  position="relative"
                  zIndex="2"
                >
                  {tabItemTypes.map((type) => {
                    // eslint-disable-next-line @typescript-eslint/no-shadow
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
                              base: '2px !important',
                              md: '6px !important',
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

              <Flex justifyContent="center" pt="8px" minH="200px">
                <TabPanels>
                  <TabPanel p="0px">
                    {isLoading ? (
                      <Center minH="200px">
                        <Spinner />
                      </Center>
                    ) : (
                      <Box w="100%">
                        <Center
                          background="#F9F9F9"
                          borderRadius="24px"
                          p="18px"
                          w="100%"
                          flexDirection={{ base: 'column', md: 'row' }}
                          mt="20px"
                        >
                          <Center>
                            <SvgRank />
                            <Text
                              ml="8px"
                              fontWeight="700"
                              fontSize="14px"
                              lineHeight="26px"
                            >
                              Collection Rank
                            </Text>
                            <Text
                              ml="16px"
                              fontWeight="700"
                              fontSize="24px"
                              lineHeight="26px"
                              color="#4E51F4"
                            >
                              {clusterInfo?.ranking}
                            </Text>
                          </Center>
                          <Spacer />
                          <Center mt={{ base: '5px', md: '0' }}>
                            <Text
                              fontWeight="400"
                              fontSize="12px"
                              lineHeight="26px"
                            >
                              Details of the ranking:
                            </Text>
                            <Link
                              href={`https://rank.cluster3.net/user/${priAddress}`}
                              target="_blank"
                              pl="5px"
                            >
                              <Image w="100px" src={PngCluster3.src} />
                            </Link>
                          </Center>
                        </Center>

                        <Center p="24px 0">
                          <Center
                            fontWeight="500"
                            fontSize="16px"
                            lineHeight="26px"
                          >
                            <Text color="#4E51F4">{hadLength}</Text>/
                            <Text>{allLength}</Text>
                            <Text ml="5px">collected</Text>
                          </Center>
                          <Spacer />
                        </Center>

                        {poapList.length ? (
                          <Box
                            className="nft-list-wrap"
                            background="#F9F9F9"
                            borderRadius="24px"
                            p={{ base: '8px', md: '16px' }}
                            w="100%"
                            maxH={{ base: 'auto', md: '100%' }}
                            overflow={{ base: 'auto', md: 'hidden' }}
                            overflowY={{ base: 'auto', md: 'scroll' }}
                          >
                            <Wrap spacing="10px">
                              {poapList.map((item) => {
                                const { name, img, hadGot, poapPlatform } = item
                                return (
                                  <WrapItem
                                    key={item.name}
                                    w={{ base: '105px', md: '120px' }}
                                    cursor="pointer"
                                    as="a"
                                    href={poapPlatform}
                                    target="_blank"
                                  >
                                    <Center flexDirection="column" w="100%">
                                      <Flex
                                        w="76px"
                                        h="110px"
                                        overflow="hidden"
                                        alignItems="center"
                                        filter={
                                          hadGot
                                            ? 'grayscale(0)'
                                            : 'grayscale(1)'
                                        }
                                      >
                                        <Image src={img} w="100%" />
                                      </Flex>
                                      <Text
                                        w="100%"
                                        mt="8px"
                                        textAlign="center"
                                        fontSize="12px"
                                        lineHeight="16px"
                                        noOfLines={2}
                                        color="#000"
                                        fontWeight="500"
                                      >
                                        {name}
                                      </Text>
                                    </Center>
                                  </WrapItem>
                                )
                              })}
                            </Wrap>
                          </Box>
                        ) : (
                          <Center
                            w="100%"
                            h="200px"
                            alignContent="center"
                            flexDirection="column"
                          >
                            <Image mt="20px" src={PngEmpty.src} w="106px" />
                          </Center>
                        )}
                      </Box>
                    )}
                  </TabPanel>
                  <TabPanel>
                    <Center
                      w="100%"
                      h="300px"
                      alignContent="center"
                      flexDirection="column"
                    >
                      Coming soon...
                      <Image mt="20px" src={PngEmpty.src} w="106px" />
                    </Center>
                  </TabPanel>
                </TabPanels>
              </Flex>
            </Tabs>
          </WrapRight>
        </WrapMain>
      </Container>
      <ProfileCardHome
        ref={cardRef}
        mailAddress={mailAddress}
        homeUrl={rootURL}
        nickname={nickname}
        // isDev
      >
        <Center
          w="325px"
          h="64px"
          background="#F3F3F3"
          borderRadius="16px"
          color="#000000"
          fontSize="12px"
          fontWeight="500"
          justifyContent="space-around"
          lineHeight={1}
        >
          <Box textAlign="center">
            <Center mt="-7px">
              <SvgRank />
            </Center>
            <Box p="3px" mt="-5px">
              Collection Rank
            </Box>
            <Box mt="3px">{clusterInfo?.ranking}</Box>
          </Box>
          <Box>
            <Center mt="-7px">
              <SvgCollect />
            </Center>
            <Center p="3px" mt="-5px">
              Collected
            </Center>
            <Center mt="3px">
              <Box color="#4E52F5" mr="2px">
                {hadLength}
              </Box>
              / <Box ml="2px">{allLength}</Box>
            </Center>
          </Box>
        </Center>
      </ProfileCardHome>
    </>
  )
}
