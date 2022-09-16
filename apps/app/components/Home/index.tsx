import React, { useMemo, useState } from 'react'
import landingBg from 'assets/svg/landing-bg.svg?url'
import styled from '@emotion/styled'
import {
  Flex,
  Heading,
  Text,
  HStack,
  Box,
  StackProps,
  Stack,
  ButtonProps,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { useAccount, useTrackClick, TrackEvent } from 'hooks'
import { Button } from 'ui'
import { truncateMiddle } from 'shared'
import {
  DISCORD_URL,
  NAVBAR_GUTTER,
  NAVBAR_HEIGHT,
  TWITTER_URL,
} from '../../constants'
import { AuthModal } from '../Auth'
import {
  useAuth,
  useIsAuthenticated,
  useIsAuthModalOpen,
} from '../../hooks/useLogin'
import { MascotSvg } from '../Whitelist/Mascot'

import { ReactComponent as DiscordSvg } from '../../assets/discord-o.svg'
import { ReactComponent as TwitterSvg } from '../../assets/twitter-o.svg'
import { RoutePath } from '../../route/path'
import { RouterLink } from '../RouterLink'
import { ConnectWallet } from '../ConnectWallet'
import { isCoinbaseWallet } from '../../utils'
import { NoOnWhiteListError } from '../../hooks/useRemember'

const Container = styled(Flex)`
  height: calc(100vh - ${NAVBAR_GUTTER + NAVBAR_HEIGHT}px);
  background-image: url(${landingBg});
  position: relative;
  flex-direction: column;
  align-items: center;
  background-repeat: no-repeat;
  background-position: 50%;
  background-size: 80%;
  box-shadow: 0px 0px 10px 4px rgba(25, 25, 100, 0.1);
  border-top-right-radius: 24px;
  border-top-left-radius: 24px;
  max-width: 100%;
  margin-top: ${NAVBAR_GUTTER}px;

  justify-content: center;

  @media (max-width: 600px) {
    justify-content: flex-start;
    background-size: 100%;
    border-top-right-radius: 0;
    border-top-left-radius: 0;
    box-shadow: none;
    background-position: 50% 15%;
    background: none;
  }

  .title {
    font-size: 28px;
    font-weight: 700;
    text-align: center;
    max-width: 500px;
    @media (max-width: 600px) {
      margin-top: 0;
      font-size: 24px;
    }
  }

  .desc {
    margin-top: 20px;
    font-weight: 500;
    font-size: 16px;
    text-align: center;
  }

  .footer {
    position: absolute;
    bottom: 0;
  }

  .link-desktop {
    @media (max-width: 600px) {
      display: none;
    }
  }

  .link-mobile {
    display: none;
    @media (max-width: 600px) {
      display: block;
    }
  }
`

const ColorfulButton = styled(Flex)`
  flex-direction: column;
  padding: 12px;
  position: relative;
  align-items: center;
  justify-content: center;

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
`

const COLORFUL_BTN_BG = `linear-gradient(90.02deg, #FFB1B1 0.01%, #FFCD4B 50.26%, #916BFF 99.99%)`

interface RenderedButtonProps extends ButtonProps {
  addr: string
}

const RenderedButton: React.FC<RenderedButtonProps> = ({ addr, ...props }) => (
  <Button w="185px" fontSize="14px" variant="outline" {...props}>
    {truncateMiddle(addr, 6, 4)}
  </Button>
)

interface IconLinkProps extends StackProps {
  icon: React.ReactNode
  href: string
  text: React.ReactNode
}

const IconLink: React.FC<IconLinkProps> = ({ icon, href, text, ...props }) => (
  <HStack
    spacing="4px"
    alignItems="center"
    as="a"
    href={href}
    target="_blank"
    {...props}
  >
    {icon}
    <Text fontWeight={500} fontSize="12px">
      {text}
    </Text>
  </HStack>
)

export const Home: React.FC = () => {
  useAuth()
  const account = useAccount()
  const isAuth = useIsAuthenticated()
  const [t] = useTranslation('testing')
  const trackDiscord = useTrackClick(TrackEvent.TestingDiscord)
  const trackTwitter = useTrackClick(TrackEvent.TestingTwitter)
  const trackEnterApp = useTrackClick(TrackEvent.TestingEnterApp)

  const [signError, setSignError] = useState<Error | null>(null)
  const isAuthModalOpen = useIsAuthModalOpen()

  const mascotIndex = useMemo(() => {
    if (
      !account ||
      isAuthModalOpen ||
      (isCoinbaseWallet() && !(signError instanceof NoOnWhiteListError))
    ) {
      return 1
    }
    if (isAuth) {
      return 2
    }
    return 3
  }, [account, isAuth, isAuthModalOpen, signError])

  const desc = useMemo(() => {
    if (mascotIndex === 2) {
      return t('success-desc')
    }
    return null
  }, [mascotIndex, signError])

  return (
    <>
      <Container>
        <Heading className="title">{t('title')}</Heading>
        <Text className="desc">{desc}</Text>
        <Box marginTop="32px">
          <ConnectWallet
            bg={COLORFUL_BTN_BG}
            fontSize="14px"
            _hover={{
              bg: COLORFUL_BTN_BG,
              opacity: 0.8,
            }}
            w="185px"
            renderConnected={(addr) => (
              <RenderedButton
                border="none"
                _hover={{ bg: 'transparent' }}
                addr={addr}
              />
            )}
            onSignError={setSignError}
          />
        </Box>
        {mascotIndex === 2 ? (
          <RouterLink href={RoutePath.Inbox} passHref>
            <Button mt="20px" w="185px" onClick={() => trackEnterApp()}>
              {t('enter-app')}
            </Button>
          </RouterLink>
        ) : null}
        <MascotSvg imageIndex={mascotIndex} />
        <Text fontWeight={700} fontSize="20px" mt="20px">
          {t('join-community')}
        </Text>
        <ColorfulButton w="350px" mt="18px" className="link-desktop">
          <Flex justifyContent="space-between" w="300px">
            <IconLink
              onClick={() => trackDiscord()}
              href={DISCORD_URL}
              icon={<DiscordSvg />}
              text={t('discord')}
            />
            <IconLink
              onClick={() => trackTwitter()}
              href={TWITTER_URL}
              icon={<TwitterSvg />}
              text={t('twitter')}
            />
          </Flex>
        </ColorfulButton>
        <Stack
          direction="column"
          spacing="14px"
          className="link-mobile"
          mt="18px"
        >
          <ColorfulButton w="185px">
            <IconLink
              onClick={() => trackDiscord()}
              href={DISCORD_URL}
              icon={<DiscordSvg />}
              text={t('discord')}
            />
          </ColorfulButton>
          <ColorfulButton w="185px">
            <IconLink
              onClick={() => trackTwitter()}
              href={TWITTER_URL}
              icon={<TwitterSvg />}
              text={t('twitter')}
            />
          </ColorfulButton>
        </Stack>
      </Container>
      <AuthModal />
    </>
  )
}
