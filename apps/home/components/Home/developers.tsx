import { Box, Flex, Grid, Heading, Link, Text } from '@chakra-ui/react'
import { Logo, GithubIcon, MirrorIcon, RightArrowIcon } from 'ui'
import { TrackEvent, useTrackClick } from 'hooks'
import { RollingBackground } from './rollingSubtitles'
import {
  MAIL3_ME_BUTTON_GITHUB_URL,
  MAIL3_ME_BUTTON_MIRROR_URL,
} from '../../constants/env'

export const Developers: React.FC = () => {
  const trackClickMmbMirror = useTrackClick(TrackEvent.ClickMmbMirror)
  const trackClickMmbGithub = useTrackClick(TrackEvent.ClickMmbGithub)
  return (
    <Box
      position="relative"
      overflow="hidden"
      pb="86px"
      h={{ base: 'auto', md: '611px' }}
    >
      <RollingBackground
        count={1}
        position="absolute"
        top="0"
        left="0"
        h="full"
        zIndex={0}
      />
      <Flex
        direction="column"
        align="center"
        justify="flex-start"
        w="full"
        h="full"
        pt="60px"
        position="relative"
        zIndex={1}
        px="20px"
      >
        <Logo
          iconProps={{
            w: { base: '24px', md: '50px' },
            h: { base: '24px', md: '50px' },
          }}
          textProps={{
            w: { base: '65px', md: '135px' },
            h: { base: '20px', md: '42px' },
          }}
          h="50px"
          w="auto"
          mx="auto"
        />
        <Heading
          fontSize={{ base: '24px', md: '48px' }}
          lineHeight="128%"
          mt={{ base: '30px', md: '70px' }}
        >
          mail<sup>3</sup> me button
        </Heading>
        <Text
          textAlign="center"
          fontSize={{ base: '14px', md: '26px' }}
          lineHeight={{ base: '18px', md: '36px' }}
          fontWeight="300"
        >
          Embed decentralized communication features for your own product
        </Text>
        <Grid
          templateColumns={{ base: '100%', md: 'repeat(2, 373px)' }}
          templateRows={{ base: 'repeat(2, 62px)', md: '225px' }}
          gap="20px"
          mt="47px"
          fontSize={{ base: '14px', md: '20px' }}
          textAlign={{ base: 'left', md: 'center' }}
          css={`
            .item {
              background-color: #ffffff;
              box-shadow: 0 0 7px rgba(0, 0, 0, 0.25);
              border-radius: 16px;
              align-items: center;
              line-height: 26px;
              display: flex;
            }
            .item:hover {
              text-decoration: none;
              transform: scale(1.05);
            }
          `}
        >
          <Link
            className="item"
            href={MAIL3_ME_BUTTON_MIRROR_URL}
            target="_blank"
            flexDirection={{ base: 'row', md: 'column' }}
            justifyContent={{ base: 'flex-start', md: 'center' }}
            px={{ base: '17px', md: '26px' }}
            onClick={() => {
              trackClickMmbMirror()
            }}
          >
            <MirrorIcon w={{ base: '32px', md: '48px' }} h="auto" />
            <Text mt={{ base: 0, md: '17px' }} ml={{ base: '10px', md: 0 }}>
              View our best access cases on mirror
            </Text>
            <RightArrowIcon
              display={{ base: 'inline-block', md: 'none' }}
              w="20px"
              ml="auto"
            />
          </Link>
          <Link
            className="item"
            href={MAIL3_ME_BUTTON_GITHUB_URL}
            target="_blank"
            flexDirection={{ base: 'row', md: 'column' }}
            justifyContent={{ base: 'flex-start', md: 'center' }}
            px={{ base: '17px', md: '26px' }}
            onClick={() => {
              trackClickMmbGithub()
            }}
          >
            <GithubIcon w={{ base: '32px', md: '48px' }} h="auto" />
            <Text mt={{ base: 0, md: '17px' }} ml={{ base: '10px', md: 0 }}>
              Check out the mail<sup>3</sup> me button access on Github
            </Text>
            <RightArrowIcon
              display={{ base: 'inline-block', md: 'none' }}
              w="20px"
              ml="auto"
            />
          </Link>
        </Grid>
      </Flex>
    </Box>
  )
}
