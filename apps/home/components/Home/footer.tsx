import {
  Box,
  Center,
  Flex,
  Grid,
  Heading,
  Icon,
  Link,
  Stack,
} from '@chakra-ui/react'
import { CONTAINER_MAX_WIDTH, Logo } from 'ui'
import React from 'react'
import { useTrackClick, TrackEvent, TrackKey, HomeCommunity } from 'hooks'
import dynamic from 'next/dynamic'
import { ReactComponent as TwitterIconSvg } from '../../assets/svg/socialMedia/twitter.svg'
import { ReactComponent as DiscordIconSvg } from '../../assets/svg/socialMedia/discord.svg'
import { ReactComponent as MirrorIconSvg } from '../../assets/svg/socialMedia/mirror.svg'
import { ReactComponent as GithubSvg } from '../../assets/svg/socialMedia/github.svg'
import {
  DISCORD_URL,
  GITHUB_URL,
  MIRROR_URL,
  TWITTER_URL,
} from '../../constants/env'

const Mail3MeButton = dynamic(() => import('./mail3MeButton'), { ssr: false })

export const Footer = () => {
  const trackClickCommunity = useTrackClick(TrackEvent.HomeClickCommunity)
  const trackClickContactus = useTrackClick(TrackEvent.HomeClickContact)
  return (
    <Center
      h={{ base: 'auto', lg: '245px' }}
      bg="#000"
      color="#fff"
      px="33px"
      py="48px"
    >
      <Flex
        w="full"
        maxW={`${CONTAINER_MAX_WIDTH}px`}
        justify="space-between"
        direction={{ base: 'column', lg: 'row' }}
      >
        <Box mb={{ base: '20px', lg: 0 }}>
          <Box>
            <Logo
              w={{ base: '139px', lg: '289px' }}
              iconProps={{
                w: { base: '32px', lg: '45px' },
                h: { base: '32px', lg: '45px' },
              }}
              textProps={{
                w: { base: '95px', lg: '122px' },
                h: { base: '27px', lg: '40px' },
              }}
              mb="auto"
            />
          </Box>
          <Box fontSize={{ base: '12px', lg: '24px' }} letterSpacing="0.04em">
            For all crypto natives
          </Box>
        </Box>
        <Grid
          templateColumns={{
            base: 'repeat(2, 50%)',
            lg: 'repeat(4, 25%)',
          }}
          w={{ base: 'auto', lg: '650px' }}
          flexWrap="wrap"
          rowGap="32px"
        >
          <Box>
            <Heading fontSize="18px" lineHeight="23px">
              Community
            </Heading>
            <Stack
              mt={{ base: '6px', md: '24px' }}
              direction={{ base: 'row', md: 'column' }}
              spacing={{ base: '36px', md: '20px' }}
              color="#F3F3F3"
              fontSize="16px"
            >
              <Link
                href={TWITTER_URL}
                display="flex"
                alignItems="center"
                target="_blank"
                onClick={() => {
                  trackClickCommunity({
                    [TrackKey.HomeCommunity]: HomeCommunity.Twitter,
                  })
                }}
              >
                <Icon as={TwitterIconSvg} w="20px" h="auto" mr="10px" />
                <Box as="span" display={{ base: 'none', md: 'inline' }}>
                  Twitter
                </Box>
              </Link>
              <Link
                href={DISCORD_URL}
                display="flex"
                alignItems="center"
                target="_blank"
                onClick={() => {
                  trackClickCommunity({
                    [TrackKey.HomeCommunity]: HomeCommunity.Discord,
                  })
                }}
              >
                <Icon as={DiscordIconSvg} w="20px" h="auto" mr="10px" />
                <Box as="span" display={{ base: 'none', md: 'inline' }}>
                  Discord
                </Box>
              </Link>
            </Stack>
          </Box>
          <Box>
            <Heading fontSize="18px" lineHeight="23px">
              Social Media
            </Heading>
            <Stack
              mt={{ base: '6px', md: '24px' }}
              direction={{ base: 'row', md: 'column' }}
              spacing={{ base: '36px', md: '20px' }}
              color="#F3F3F3"
              fontSize="16px"
            >
              <Link
                href={MIRROR_URL}
                display="flex"
                alignItems="center"
                target="_blank"
                onClick={() => {
                  trackClickCommunity({
                    [TrackKey.HomeCommunity]: HomeCommunity.Mirror,
                  })
                }}
              >
                <Icon as={MirrorIconSvg} w="20px" h="auto" mr="10px" />
                <Box as="span" display={{ base: 'none', md: 'inline' }}>
                  Mirror
                </Box>
              </Link>
            </Stack>
          </Box>
          <Box>
            <Heading fontSize="18px" lineHeight="23px">
              Developers
            </Heading>
            <Stack mt={{ base: '6px', md: '24px' }}>
              <Link
                href={GITHUB_URL}
                target="_blank"
                display="flex"
                alignItems="center"
              >
                <Icon as={GithubSvg} w="20px" h="auto" mr="10px" />
                <Box as="span" display={{ base: 'none', md: 'inline' }}>
                  Github
                </Box>
              </Link>
            </Stack>
          </Box>
          <Box>
            <Heading fontSize="18px" lineHeight="23px">
              Support
            </Heading>
            <Stack
              mt={{ base: '6px', md: '24px' }}
              color="#F3F3F3"
              fontSize="16px"
            >
              <Link
                onClick={() => {
                  trackClickContactus()
                }}
              >
                <Mail3MeButton />
              </Link>
            </Stack>
          </Box>
        </Grid>
      </Flex>
    </Center>
  )
}
