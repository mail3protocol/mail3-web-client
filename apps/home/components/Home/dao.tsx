import {
  Center,
  Grid,
  Heading,
  Icon,
  Link,
  Stack,
  Text,
  VStack,
  Flex,
  Box,
} from '@chakra-ui/react'
import { CONTAINER_MAX_WIDTH } from 'ui'
import React, { useEffect, useRef, useState } from 'react'
import styled from '@emotion/styled'
import { fromEvent } from 'rxjs'
import { useTrackClick, TrackEvent, TrackKey, HomeCommunity } from 'hooks'
import Illustration2Svg from '../../assets/svg/illustration/2.svg'
import TwitterIconSvg from '../../assets/svg/socialMedia/twitter.svg'
import MirrorIconSvg from '../../assets/svg/socialMedia/mirror.svg'
import DiscordIconSvg from '../../assets/svg/socialMedia/discord.svg'
import { DISCORD_URL, MIRROR_URL, TWITTER_URL } from '../../constants/env'

const IllustrationText = styled(Box)`
  font-family: NanumPenScript-Regular, serif;
  color: transparent;
  font-size: 32px;
  height: auto;
  padding: 30px 20px 0;
  -webkit-text-fill-color: transparent;
  background: linear-gradient(
    87.97deg,
    #ffa51e -0.16%,
    #ddcae2 20.98%,
    #a9f0ff 43.13%,
    #fff84f 58.53%,
    #e6ffb2 76.82%,
    #3b2aff 92.26%,
    #ffa51e 100%
  );
  -webkit-background-clip: text;
  animation: run-text-bg 5s linear infinite;
  transform-origin: top center;
  @keyframes run-text-bg {
    from {
      backgroud-position: 0 0;
    }
    to {
      background-position: 2000px 0;
    }
  }
`

export const Dao = () => {
  const [illustrationTextScale, setIllustrationTextScale] = useState(1)
  const illustrationContainerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const onChangeIllustrationTextScale = () => {
      const v = Math.min(
        (illustrationContainerRef.current?.offsetWidth || 488) / 488,
        1
      )
      setIllustrationTextScale(v)
    }
    const subscriber = fromEvent(window, 'resize').subscribe(
      onChangeIllustrationTextScale
    )
    onChangeIllustrationTextScale()
    return () => {
      subscriber.unsubscribe()
    }
  }, [])
  const trackClickCommunity = useTrackClick(TrackEvent.HomeClickCommunity)
  return (
    <Center
      w="full"
      h="auto"
      minH={{ base: '667px', md: '749px' }}
      bg="#000"
      color="#fff"
      px={{ base: '20px', md: '30px' }}
    >
      <Grid
        w="full"
        maxW={`${CONTAINER_MAX_WIDTH}px`}
        h="full"
        templateColumns={{
          base: '100%',
          md: '60% 40%',
        }}
        templateRows={{
          base: 'auto auto auto',
          md: '60% 40%',
        }}
        gap={{ base: '20px', md: 0 }}
        textAlign={{
          base: 'center',
          md: 'left',
        }}
        py="64px"
      >
        <Flex
          direction="column"
          pb={{ base: 0, md: '32px' }}
          pt={{ base: '20px', md: '26px' }}
          pr="24px"
        >
          <Heading
            fontSize="56px"
            lineHeight="56px"
            mb={{ base: '24px', md: '48px' }}
            w="full"
          >
            Mail3 Postoffice
          </Heading>
          <Text
            fontSize={{ base: '18px', md: '24px' }}
            lineHeight={{ base: '24px', md: '48px' }}
            mb="32px"
            fontWeight="300"
            w="full"
            maxW={{ base: 'unset', md: '570px' }}
          >
            Mail3 Postoffice is the decentralized autonomous organization owned
            by the community to govern the protocol development, the
            collaboration between interested parties, and so on.
          </Text>
        </Flex>
        <Center
          gridRowEnd={{
            base: 'unset',
            md: 'span 2',
          }}
          gridColumn={{
            base: 'unset',
            md: '2',
          }}
          ref={illustrationContainerRef}
        >
          <Box
            w="full"
            h="full"
            position="relative"
            transformOrigin="top right"
            style={{
              transform: `scale(${illustrationTextScale})`,
              width: `${488 * illustrationTextScale}px`,
              height: `${402 * illustrationTextScale}px`,
            }}
          >
            <Icon
              as={Illustration2Svg}
              w="488px"
              h="402px"
              mt="auto"
              mr="auto"
              position="absolute"
              top="0"
              right="0"
            />
            <IllustrationText
              w="410px"
              position="absolute"
              top="0"
              right="0"
              bgClip="text"
            >
              Together we protect our own realm, make our own rules.
            </IllustrationText>
          </Box>
        </Center>
        <VStack justify="end">
          <Heading fontSize="36px" w="full" mb="26px">
            Join Now
          </Heading>
          <Stack
            direction="row"
            fontWeight="500"
            fontSize="20px"
            w="full"
            pb="26px"
            justify={{
              base: 'space-between',
              md: 'start',
            }}
            spacing={{
              base: '30px',
              md: '56px',
            }}
            maxW={{ base: '200px', md: 'unset' }}
          >
            <Link
              href={TWITTER_URL}
              _hover={{ transform: 'scale(1.2)' }}
              transition="100ms"
              h="40px"
              rounded="100px"
              target="_blank"
              onClick={() => {
                trackClickCommunity({
                  [TrackKey.HomeCommunity]: HomeCommunity.Twitter,
                })
              }}
            >
              <Icon
                as={TwitterIconSvg}
                w={{ base: '25px', md: '40px' }}
                h="auto"
              />
            </Link>
            <Link
              href={MIRROR_URL}
              _hover={{ transform: 'scale(1.2)' }}
              transition="100ms"
              h="40px"
              rounded="100px"
              target="_blank"
              onClick={() => {
                trackClickCommunity({
                  [TrackKey.HomeCommunity]: HomeCommunity.Mirror,
                })
              }}
            >
              <Icon
                as={MirrorIconSvg}
                w={{ base: '25px', md: '40px' }}
                h="auto"
              />
            </Link>
            <Link
              href={DISCORD_URL}
              _hover={{ transform: 'scale(1.2)' }}
              transition="100ms"
              h="40px"
              rounded="100px"
              target="_blank"
              onClick={() => {
                trackClickCommunity({
                  [TrackKey.HomeCommunity]: HomeCommunity.Discord,
                })
              }}
            >
              <Icon
                as={DiscordIconSvg}
                w={{ base: '25px', md: '40px' }}
                h="auto"
              />
            </Link>
          </Stack>
        </VStack>
      </Grid>
    </Center>
  )
}
