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
import { CONTAINER_MAX_WIDTH } from 'ui'
import React from 'react'
import LogoWithWhiteFontColorSvg from 'assets/svg/logo-with-white-font.svg'
import TwitterIconSvg from '../../assets/svg/socialMedia/twitter.svg'
import DiscordIconSvg from '../../assets/svg/socialMedia/discord.svg'
import MirrorIconSvg from '../../assets/svg/socialMedia/mirror.svg'
import {
  CONTACT_US_URL,
  DISCORD_URL,
  MIRROR_URL,
  TWITTER_URL,
} from '../../constants/env'

export const Footer = () => (
  <Center
    h={{ base: 'auto', md: '352px' }}
    bg="#000"
    color="#fff"
    px="33px"
    py="48px"
  >
    <Flex
      w="full"
      maxW={`${CONTAINER_MAX_WIDTH}px`}
      justify="space-between"
      direction={{ base: 'column', md: 'row' }}
    >
      <Box mb={{ base: '20px', md: 0 }}>
        <Icon
          as={LogoWithWhiteFontColorSvg}
          w={{ base: '139px', md: '275px' }}
          h="auto"
        />
        <Box fontSize={{ bsae: '12px', md: '24px' }} letterSpacing="0.04em">
          For all crytpo natives
        </Box>
      </Box>
      <Grid
        templateColumns={{
          base: 'repeat(2, 50%)',
          md: 'repeat(3, 33.3%)',
        }}
        w={{ base: 'auto', md: '500px' }}
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
            <Link href={TWITTER_URL} display="flex" alignItems="center">
              <Icon as={TwitterIconSvg} w="20px" h="auto" mr="10px" />
              <Box as="span" display={{ base: 'none', md: 'inline' }}>
                Twitter
              </Box>
            </Link>
            <Link href={DISCORD_URL} display="flex" alignItems="center">
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
            <Link href={MIRROR_URL} display="flex" alignItems="center">
              <Icon as={MirrorIconSvg} w="20px" h="auto" mr="10px" />
              <Box as="span" display={{ base: 'none', md: 'inline' }}>
                Mirror
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
            <Link href={CONTACT_US_URL}>
              <Box>Contact US</Box>
            </Link>
          </Stack>
        </Box>
      </Grid>
    </Flex>
  </Center>
)
