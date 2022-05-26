import {
  Flex,
  VStack,
  Heading,
  Text,
  Stack,
  Divider,
  Box,
  Link,
  HStack,
} from '@chakra-ui/react'
import { TrackEvent, useAccount, useTrackClick } from 'hooks'
import { useTranslation, Trans } from 'next-i18next'
import React, { useMemo } from 'react'
import styled from '@emotion/styled'
import { CheckCircleIcon } from '@chakra-ui/icons'
import { Button, ConnectWallet } from 'ui'
import classNames from 'classnames'
import landingBg from 'assets/svg/landing-bg.svg?url'
import { useAuth, useIsAuthenticated } from '../../hooks/useLogin'
import { Mascot } from './Mascot'
import FirstIconSvg from '../../assets/whitelist/first.svg'
import SecondIconSvg from '../../assets/whitelist/second.svg'
import DiscordSvg from '../../assets/discord.svg'
import DiscordWhiteSvg from '../../assets/discord-white.svg'
import TwitterSvg from '../../assets/twitter.svg'
import { truncateMiddle } from '../../utils'
import {
  DISCORD_URL,
  NAVBAR_GUTTER,
  NAVBAR_HEIGHT,
  TWITTER_URL,
} from '../../constants'
import { AuthModal } from '../Auth'

const Container = styled(Flex)`
  height: calc(100vh - ${NAVBAR_GUTTER + NAVBAR_HEIGHT}px);
  background-image: url(${landingBg});
  position: relative;
  flex-direction: column;
  align-items: center;
  background-repeat: no-repeat;
  background-position: 50% calc(50% - 100px);
  background-size: 80%;
  box-shadow: 0px 0px 10px 4px rgba(25, 25, 100, 0.1);
  border-top-right-radius: 24px;
  border-top-left-radius: 24px;
  margin-top: ${NAVBAR_GUTTER}px;

  @media (max-width: 600px) {
    background-size: 100%;
    border-top-right-radius: 0;
    border-top-left-radius: 0;
    box-shadow: none;
  }

  .footer {
    position: absolute;
    bottom: 0;
  }
`

const ConnectBox = styled(Flex)`
  flex-direction: column;
  padding: 32px 50px 32px 50px;
  /* border-image-slice: 1;
  border-image-source: linear-gradient(
    90.02deg,
    #ffb1b1 0.01%,
    #ffcd4b 50.26%,
    #916bff 99.99%
  ); */
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    padding: 2px;
    border-radius: 24px;
    z-index: -1;
    background: linear-gradient(
      90.02deg,
      #ffb1b1 0.01%,
      #ffcd4b 50.26%,
      #916bff 99.99%
    );
    -webkit-mask: linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
  }

  .icon {
    margin-right: 36px;
  }

  .title {
    font-size: 16px;
    font-weight: 700;
  }

  .desc {
    font-size: 12px;
    color: #6f6f6f;
    &.black {
      color: black;
    }
  }

  .content {
    height: 125px;
    flex-direction: row;
    margin-top: 10px;
    margin-bottom: 10px;
    .divider {
      margin-left: 8px;
      margin-right: 45px;
    }
    &.auto {
      height: auto;
    }
  }

  @media (max-width: 767px) {
    border: none;
    padding: 0;

    .icon {
      margin-right: 16px;
    }

    .content {
      .divider {
        margin-right: 26px;
      }
    }

    &::before {
      background: none;
    }
  }
`

const COLORFUL_BTN_BG = `linear-gradient(90.02deg, #FFB1B1 0.01%, #FFCD4B 50.26%, #916BFF 99.99%)`
const moreDetailsLink =
  'https://feather-amaryllis-11e.notion.site/Join-the-Whitelist-and-get-the-early-access-to-Mail3-43c1bf8f21ff443ca3ca4b6f1119e0b8'

export const WhiteList: React.FC = () => {
  const [t] = useTranslation('whitelist')
  const account = useAccount()
  const isAuth = useIsAuthenticated()
  const trackDiscord = useTrackClick(TrackEvent.WhiteListDiscord)
  const trackTwitter = useTrackClick(TrackEvent.WhiteListTwitter)
  const trackMoreDetail = useTrackClick(TrackEvent.WhiteListMoreDetails)

  const mascotIndex = useMemo(() => {
    if (!account) {
      return 1
    }
    if (isAuth) {
      return 2
    }
    return 3
  }, [account, isAuth])

  const firstIcon = useMemo(() => {
    if (mascotIndex === 1) {
      return <FirstIconSvg />
    }
    return (
      <CheckCircleIcon
        color={mascotIndex === 2 ? '#29CB00' : '#6F6F6F'}
        boxSize="18px"
      />
    )
  }, [mascotIndex])

  const firstDesc = useMemo(() => {
    if (mascotIndex === 1) {
      return t('check-desc')
    }
    if (mascotIndex === 2) {
      return t('success')
    }
    return (
      <Trans
        ns="whitelist"
        i18nKey="fail"
        t={t}
        components={{
          a: (
            <Link
              isExternal
              href={DISCORD_URL}
              onClick={() => trackDiscord()}
              color="#4E52F5"
              textDecoration="underline"
              fontWeight={700}
            />
          ),
        }}
      />
    )
  }, [mascotIndex])
  useAuth()

  return (
    <>
      <Container>
        <Stack
          spacing="40px"
          direction="column"
          maxW="480px"
          mt={['10px', '10px', '72px']}
        >
          <VStack textAlign="center">
            <Heading fontSize="28px">{t('title')}</Heading>
            <Heading fontSize="16px">{t('period')}</Heading>
            <Text>{t('desc')}</Text>
          </VStack>
          <ConnectBox>
            <Flex
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Flex flexDirection="row">
                <Box className="icon">{firstIcon}</Box>
                <Text className="title">{t('check')}</Text>
              </Flex>
              <Link
                isExternal
                href={moreDetailsLink}
                fontSize="12px"
                onClick={() => trackMoreDetail()}
                textDecoration="underline"
                cursor="pointer"
              >
                {t('more-details')}
              </Link>
            </Flex>
            <Flex className="content">
              <Divider
                variant="dashed"
                className="divider"
                orientation="vertical"
                borderColor="black"
              />
              <VStack spacing="16px" alignItems="baseline">
                <Text
                  className={classNames({
                    black: isAuth,
                    desc: true,
                  })}
                >
                  {firstDesc}
                </Text>
                <ConnectWallet
                  bg={COLORFUL_BTN_BG}
                  fontSize="14px"
                  _hover={{
                    bg: COLORFUL_BTN_BG,
                    opacity: 0.8,
                  }}
                  w="185px"
                  renderConnected={(addr) => (
                    <Button w="185px" fontSize="14px" variant="outline">
                      {truncateMiddle(addr, 6, 4)}
                    </Button>
                  )}
                />
              </VStack>
            </Flex>
            <Flex flexDirection="row">
              <Box className="icon">
                <SecondIconSvg />
              </Box>
              <Text className="title">
                {isAuth ? t('join-community') : t('earlybird')}
              </Text>
            </Flex>
            <Flex className="content auto">
              <Divider
                variant="dashed"
                className="divider"
                orientation="vertical"
                visibility="hidden"
              />
              <VStack spacing="16px" alignItems="baseline" w="100%">
                <Text className="desc">
                  {mascotIndex === 3
                    ? t('join-community-desc')
                    : t('earlybird-desc')}
                </Text>
                <Stack
                  w="100%"
                  direction={['column', 'column', 'row']}
                  alignItems="baseline"
                  spacing="24px"
                  justifyContent={['baseline', 'baseline', 'space-between']}
                >
                  <Button
                    fontSize="14px"
                    w="140px"
                    variant={mascotIndex === 1 ? 'outline' : undefined}
                    bg={mascotIndex !== 1 ? COLORFUL_BTN_BG : undefined}
                    _hover={{
                      bg: mascotIndex !== 1 ? COLORFUL_BTN_BG : undefined,
                      opacity: mascotIndex !== 1 ? 0.8 : undefined,
                    }}
                  >
                    <HStack
                      spacing="4px"
                      alignItems="center"
                      as="a"
                      onClick={() => trackDiscord()}
                      href={DISCORD_URL}
                      target="_blank"
                    >
                      {mascotIndex !== 1 ? <DiscordWhiteSvg /> : <DiscordSvg />}
                      <Text>{t('discord')}</Text>
                    </HStack>
                  </Button>
                  <Link
                    href={TWITTER_URL}
                    onClick={() => trackTwitter()}
                    isExternal
                  >
                    <HStack spacing="4px">
                      <TwitterSvg />
                      <Text>{t('twitter')}</Text>
                    </HStack>
                  </Link>
                </Stack>
              </VStack>
            </Flex>
          </ConnectBox>
        </Stack>
        <Flex
          position="static"
          w="full"
          justifyContent="flex-end"
          transition="200ms"
          flex={1}
          bottom="0"
          textAlign="right"
          alignItems="end"
        >
          <Mascot imageIndex={mascotIndex} />
        </Flex>
      </Container>
      <AuthModal />
    </>
  )
}
