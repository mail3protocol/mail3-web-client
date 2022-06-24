import {
  Box,
  Center,
  HStack,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  Wrap,
  WrapItem,
} from '@chakra-ui/react'
import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { Avatar, Button, ProfileCard } from 'ui'
import { useMemo, useRef } from 'react'
import {
  ProfileScoialPlatformItem,
  TrackEvent,
  TrackKey,
  useScreenshot,
  useToast,
  useTrackClick,
} from 'hooks'
import { copyText, shareToTwitter } from 'shared'

import SvgMailme from 'assets/profile/mail-me.svg'
import SvgCopy from 'assets/profile/copy.svg'
import SvgShare from 'assets/profile/share.svg'
import SvgTwitter from 'assets/profile/twitter.svg'
import SvgMore from 'assets/profile/more.svg'

import SvgEtherscan from 'assets/profile/business/etherscan.svg'
import SvgCyber from 'assets/profile/business/arrow.svg'

enum ButtonType {
  Copy,
  Card,
  Twitter,
}

enum ScoialPlatform {
  CyberConnect = 'CyberConnect',
  Etherscan = 'Etherscan',
}

const Container = styled(Box)`
  position: relative;
  max-width: 475px;
  margin: 120px auto;
  padding: 60px 20px 55px 20px;
  background-color: #ffffff;
  box-shadow: 0px 0px 10px 4px rgba(25, 25, 100, 0.1);
  border-radius: 24px;

  .avatar {
    top: -40px;
    left: 50%;
    transform: translateX(-50%);
    position: absolute;
    border: 4px solid #fff;
    border-radius: 50%;
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
    padding: 13px;
    text-align: center;

    .p {
      font-style: normal;
      font-weight: 600;
      font-size: 24px;
      line-height: 28px;
    }
  }

  @media (max-width: 600px) {
    max-width: 325px;

    .button-list {
      .button-wrap-mobile {
        display: block;
      }
      .button-wrap-pc {
        display: none;
      }
    }
  }
`

interface ProfileComponentProps {
  mailAddress: string
  address: string
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
  const trackMailme = useTrackClick(TrackEvent.ClickProfileMailMe)
  const trackScoialDimensions = useTrackClick(
    TrackEvent.ClickProfileScoialPlatform
  )

  const toast = useToast()
  const { downloadScreenshot } = useScreenshot()

  const popoverRef = useRef<HTMLElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

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
  }

  const homeUrl = `${window.location.origin}`

  const profileUrl: string = useMemo(() => `${homeUrl}/${address}`, [address])

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
          text: 'Hey, contact me using my Mail3 email address',
          url: profileUrl,
          hashtags: ['mail3', 'mail3dao'],
        })
      },
      [ButtonType.Card]: async () => {
        trackCard()
        if (!cardRef?.current) return
        try {
          downloadScreenshot(cardRef.current, 'share.png')
        } catch (error) {
          toast('Download screenshot Error!')
        }

        popoverRef?.current?.blur()
      },
    }),
    [mailAddress, address]
  )

  const getHref = (type: ScoialPlatform) => {
    if (type === ScoialPlatform.CyberConnect) {
      return `https://app.cyberconnect.me/address/${address}`
    }

    return `https://etherscan.io/address/${address}`
  }

  return (
    <>
      <Container>
        <Box className="avatar">
          <Avatar address={address} w="72px" h="72px" />
        </Box>
        <Box className="button-list">
          <Box className="button-wrap-mobile">
            <Popover offset={[0, 10]} arrowSize={18} autoFocus>
              <PopoverTrigger>
                <Box p="10px">
                  <SvgMore />
                </Box>
              </PopoverTrigger>
              <PopoverContent
                width="auto"
                _focus={{
                  boxShadow: '0px 0px 16px 12px rgba(192, 192, 192, 0.25)',
                  outline: 'none',
                }}
                borderRadius="20px"
                ref={popoverRef}
              >
                <PopoverArrow />
                <PopoverBody>
                  <Wrap p="14px" direction="column">
                    {[ButtonType.Twitter, ButtonType.Copy, ButtonType.Card].map(
                      (type: ButtonType) => {
                        const { Icon, label } = buttonConfig[type]
                        const onClick = actionMap[type]

                        return (
                          <WrapItem
                            key={type}
                            p="5px"
                            borderRadius="10px"
                            _hover={{
                              bg: '#E7E7E7',
                            }}
                          >
                            <Center as="button" onClick={onClick}>
                              <Box>
                                <Icon />
                              </Box>
                              <Text pl="10px">{label}</Text>
                            </Center>
                          </WrapItem>
                        )
                      }
                    )}
                  </Wrap>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </Box>
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
        </Box>
        <Box className="address">
          <Text className="p">{mailAddress}</Text>
        </Box>
        <Center mt="25px">
          <HStack spacing="24px">
            {[ScoialPlatform.CyberConnect, ScoialPlatform.Etherscan].map(
              (itemKey: ScoialPlatform, index) => {
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
              }
            )}
          </HStack>
        </Center>
      </Container>

      <Center>
        <Button
          w="250px"
          onClick={() => {
            trackMailme()
          }}
        >
          <SvgMailme /> <Box pl="10px">Mail me</Box>
        </Button>
      </Center>

      <ProfileCard ref={cardRef} mailAddress={mailAddress} homeUrl={homeUrl}>
        {[ScoialConfig.CyberConnect, ScoialConfig.Etherscan].map(
          ({ Icon }, index) => (
            <Box
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              w="24px"
              h="24px"
            >
              <Icon />
            </Box>
          )
        )}
      </ProfileCard>
    </>
  )
}
