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
import { Avatar, ProfileCard } from 'ui'
import { useMemo, useRef, useState } from 'react'
import {
  ProfileScoialPlatformItem,
  TrackEvent,
  TrackKey,
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
} from 'shared'
import dynamic from 'next/dynamic'
import { useQuery } from 'react-query'
import { ReactComponent as SvgCopy } from 'assets/profile/copy.svg'
import { ReactComponent as SvgShare } from 'assets/profile/share.svg'
import { ReactComponent as SvgTwitter } from 'assets/profile/twitter.svg'
import { ReactComponent as SvgEtherscan } from 'assets/profile/business/etherscan.svg'
import { ReactComponent as SvgCyber } from 'assets/profile/business/arrow.svg'
import { ReactComponent as SvgZiliqa } from 'assets/svg/zilliqa.svg'
import { ReactComponent as SvgRank } from '../../assets/svg/rank.svg'
import PngCluster3 from '../../assets/png/cluster3.png'
import PngEmpty from '../../assets/png/empty.png'
import { useAPI } from '../../api'

const Mail3MeButton = dynamic(() => import('./mail3MeButton'), { ssr: false })

enum ButtonType {
  Copy,
  Card,
  Twitter,
}

enum ScoialPlatform {
  CyberConnect = 'CyberConnect',
  Etherscan = 'Etherscan',
  ViewBlock = 'ViewBlock',
}

const Container = styled(Box)`
  background: #ffffff;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.15);
  border-radius: 24px;
  max-width: 1220px;
  width: 100%;
  margin: 0 auto;
  min-height: 700px;

  @media (max-width: 600px) {
    box-shadow: none;
  }
`

const WrapMain = styled(Center)`
  height: 100%;
  width: 100%;
  margin: 0 auto;
  max-width: 1100px;
  position: relative;
  align-items: flex-start;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: center;
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
  flex-direction: column;

  .avatar {
  }

  .button-list {
    top: 5px;
    right: 15px;
    position: absolute;

    .button-wrap-mobile {
      display: none;
    }
  }

  .address {
    background: #f3f3f3;
    border-radius: 16px;
    padding: 4px 8px;
    margin-top: 26px;
    text-align: center;

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
  }
`

const WrapRight = styled(Box)`
  width: 100%;
  padding: 40px;

  @media (max-width: 600px) {
    padding: 10px;
  }
`

interface ProfileComponentProps {
  mailAddress: string
  address: string
}

let homeUrl = ''
if (typeof window !== 'undefined') {
  homeUrl = `${window?.location?.origin}`
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

export const ProfileComponent: React.FC<ProfileComponentProps> = ({
  mailAddress,
  address,
}) => {
  const [t] = useTranslation('profile')
  const [t2] = useTranslation('common')

  const trackTwitter = useTrackClick(TrackEvent.ClickProfileTwitter)
  const trackCopy = useTrackClick(TrackEvent.ClickProfileCopy)
  const trackCard = useTrackClick(TrackEvent.ClickProfileDownloadCard)
  const trackScoialDimensions = useTrackClick(
    TrackEvent.ClickProfileScoialPlatform
  )

  const api = useAPI()
  const toast = useToast()
  const { downloadScreenshot } = useScreenshot()

  const [isDid, setIsDid] = useState(false)
  const popoverRef = useRef<HTMLElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  const { data: _0xaddr, isLoading } = useQuery(
    ['bit', address],
    async () => {
      try {
        const { data } = await api.getBitToEthResponse(address)
        return data.account_info.owner_key
      } catch (error) {
        return ''
      }
    },
    {
      refetchIntervalInBackground: false,
      refetchOnMount: true,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      enabled: isBitDomain(address),
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

  const ScoialConfig: Record<
    ScoialPlatform,
    {
      Icon: any
    }
  > = {
    [ScoialPlatform.CyberConnect]: {
      Icon: SvgCyber,
    },
    [ScoialPlatform.Etherscan]: {
      Icon: SvgEtherscan,
    },
    [ScoialPlatform.ViewBlock]: {
      Icon: SvgZiliqa,
    },
  }

  const tabItemTypes = [TabItemType.Collection, TabItemType.Updates]

  const profileUrl: string = useMemo(() => `${homeUrl}/${address}`, [address])

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

  const getHref = (type: ScoialPlatform) => {
    const realAddr = _0xaddr || address

    if (type === ScoialPlatform.CyberConnect) {
      return `https://app.cyberconnect.me/address/${realAddr}`
    }
    if (type === ScoialPlatform.ViewBlock) {
      return `https://viewblock.io/zilliqa/address/${address}`
    }

    return `https://etherscan.io/address/${realAddr}`
  }

  const socials = isZilpayAddress(address)
    ? [ScoialConfig.ViewBlock]
    : [ScoialConfig.CyberConnect, ScoialConfig.Etherscan]

  const socialPlatforms = isZilpayAddress(address)
    ? [ScoialPlatform.ViewBlock]
    : [ScoialPlatform.CyberConnect, ScoialPlatform.Etherscan]
  useDidMount(() => {
    setIsDid(true)
  })

  if (!isDid) return null

  return (
    <>
      <Container>
        <WrapMain>
          <WrapLeft>
            <Box className="avatar">
              <Avatar address={address} w="64px" h="64px" />
            </Box>
            <Box className="button-list">
              {isLoading ? (
                <Spinner />
              ) : (
                <HStack className="button-wrap-pc">
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
              )}
            </Box>
            <Box className="address">
              <Text className="p">{mailAddress}</Text>
            </Box>
            <Center mt="25px">
              <Mail3MeButton to={mailAddress} />
            </Center>
            <Center mt="25px">
              <HStack spacing="24px">
                {socialPlatforms.map((itemKey: ScoialPlatform, index) => {
                  const { Icon } = ScoialConfig[itemKey]
                  return (
                    <Box
                      // eslint-disable-next-line react/no-array-index-key
                      key={index}
                      w={{ base: '24px', md: '36px' }}
                      h={{ base: '24px', md: '36px' }}
                      as="a"
                      href={getHref(itemKey)}
                      target="_blank"
                      onClick={() => {
                        if (itemKey === ScoialPlatform.CyberConnect) {
                          trackScoialDimensions({
                            [TrackKey.ProfileScoialPlatform]:
                              ProfileScoialPlatformItem.CyberConnect,
                          })
                        }

                        if (itemKey === ScoialPlatform.Etherscan) {
                          trackScoialDimensions({
                            [TrackKey.ProfileScoialPlatform]:
                              ProfileScoialPlatformItem.Etherscan,
                          })
                        }
                      }}
                    >
                      <Icon />
                    </Box>
                  )
                })}
              </HStack>
            </Center>
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
                            ml: '20px',
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
                    <Box w="100%">
                      <Center
                        background="#F9F9F9"
                        borderRadius="24px"
                        p="18px"
                        w="100%"
                        flexDirection={{ base: 'column', md: 'row' }}
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
                            1000
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
                          <Link href="#" pl="5px">
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
                          <Text color="#4E51F4">4</Text>/<Text>8</Text>
                          <Text ml="5px">collected</Text>
                        </Center>
                        <Spacer />
                        <Link color="#4E51F4" fontSize="14px">
                          view all
                        </Link>
                      </Center>

                      <Box
                        background="#F9F9F9"
                        borderRadius="24px"
                        p={{ base: '8px', md: '18px' }}
                        w="100%"
                      >
                        <Wrap spacing="10px">
                          <WrapItem w="100px">
                            <Center flexDirection="column">
                              <Image src="#" w="76px" h="110px" />
                              <Text mt="8px" textAlign="center">
                                Mail of the Month 2022
                              </Text>
                            </Center>
                          </WrapItem>
                          <WrapItem w="100px">
                            <Center flexDirection="column">
                              <Image src="#" w="76px" h="110px" />
                              <Text mt="8px" textAlign="center">
                                Mail of the Month 2022
                              </Text>
                            </Center>
                          </WrapItem>
                          <WrapItem w="100px">
                            <Center flexDirection="column">
                              <Image src="#" w="76px" h="110px" />
                              <Text mt="8px" textAlign="center">
                                Mail of the Month 2022
                              </Text>
                            </Center>
                          </WrapItem>
                          <WrapItem w="100px">
                            <Center flexDirection="column">
                              <Image src="#" w="76px" h="110px" />
                              <Text mt="8px" textAlign="center">
                                Mail of the Month 2022
                              </Text>
                            </Center>
                          </WrapItem>
                          <WrapItem w="100px">
                            <Center flexDirection="column">
                              <Image src="#" w="76px" h="110px" />
                              <Text mt="8px" textAlign="center">
                                Mail of the Month 2022
                              </Text>
                            </Center>
                          </WrapItem>
                        </Wrap>
                      </Box>
                    </Box>
                  </TabPanel>
                  <TabPanel>
                    <Center
                      w="100%"
                      h="200px"
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

      <ProfileCard ref={cardRef} mailAddress={mailAddress} homeUrl={homeUrl}>
        {socials.map(({ Icon }, index) => (
          <Box
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            w="24px"
            h="24px"
          >
            <Icon />
          </Box>
        ))}
      </ProfileCard>
    </>
  )
}
