import { useTranslation } from 'next-i18next'
import {
  Box,
  Center,
  Flex,
  Heading,
  Icon,
  Image,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react'
import React from 'react'
import { Button, ConnectWallet, CONTAINER_MAX_WIDTH, LogoAnimation } from 'ui'
import LogoWithWhiteFontColorSvg from 'assets/svg/logo-with-white-font.svg'
import { Navbar } from './navbar'
import { RainbowBar } from './rainbowBar'
import HomeGridBgSvgPath from '../../assets/svg/home-grid-bg.svg?url'
import Illustration1Svg from '../../assets/svg/illustration/1.svg'
import ArrowRightSvg from '../../assets/svg/illustration/arrow-right.svg'
import ArrowLeftSvg from '../../assets/svg/illustration/arrow-left.svg'
import EnvelopeBgSvg from '../../assets/svg/envelope-bg.svg'
import EnvelopeBottomCoverSvg from '../../assets/svg/envelope-bottom-cover.svg'
import TwitterIconSvg from '../../assets/svg/socialMedia/twitter.svg'
import MediumIconSvg from '../../assets/svg/socialMedia/medium.svg'
import MirrorIconSvg from '../../assets/svg/socialMedia/mirror.svg'
import DiscordIconSvg from '../../assets/svg/socialMedia/discord.svg'
import Illustration2Svg from '../../assets/svg/illustration/2.svg'
import HomeGridBgBottomSvgPath from '../../assets/svg/home-grid-bg-bottom.svg?url'
import { RollingSubtitles } from './rollingSubtitles'
import { isBetaTestingStage, isWhiteListStage } from '../../utils/whitelist'

export const Home: React.FC = () => {
  const { t } = useTranslation('index')
  const isShowRainbowBar = isWhiteListStage() || isBetaTestingStage()
  const text1 = "Mail3 is the world's first web3 email protocol."
  return (
    <Flex direction="column" position="relative">
      {isShowRainbowBar ? <RainbowBar /> : null}
      <Navbar />
      <Flex
        direction="column"
        align="center"
        h={`calc(100vh${isShowRainbowBar ? '- 44px' : ''} - 60px)`}
        position="relative"
      >
        <Image
          src={HomeGridBgSvgPath}
          objectFit="cover"
          objectPosition="center bottom"
          w="full"
          h="full"
          position="absolute"
        />
        <Center
          h="full"
          w="full"
          maxW={`${CONTAINER_MAX_WIDTH}px`}
          position="relative"
        >
          <Icon
            w="150px"
            as={Illustration1Svg}
            h="auto"
            position="absolute"
            top="98px"
            left="64px"
          />
          <Box position="relative" w="full" my="auto">
            <Heading fontSize="48px" textAlign="center" lineHeight="60px">
              Communicate everyone <br /> in web3.0
            </Heading>
            <Heading
              mt="16px"
              fontSize="24px"
              textAlign="center"
              fontWeight="normal"
              mb="57px"
            >
              {text1}
              <br />
              Primitive communication beyond the blockchain.
            </Heading>
            <Flex justify="center" align="center">
              <Icon as={ArrowRightSvg} mr="34px" w="83px" h="54px" />
              <ConnectWallet
                renderConnected={(address) => (
                  <Button variant="outline">
                    {address.substring(0, 6)}…
                    {address.substring(address.length - 4)}
                  </Button>
                )}
              />
              <Icon as={ArrowLeftSvg} ml="34px" w="83px" h="54px" />
            </Flex>
            <Text textAlign="center" mt="15px" fontSize="14px">
              Connect your wallet to use @mail3.me
            </Text>
          </Box>
        </Center>
      </Flex>
      <Box bg="#000" h="44px" overflow="hidden" position="relative">
        <RollingSubtitles lineHeight="44px" fontWeight="bold">
          <Flex minW="100vh" justify="space-between">
            {new Array(30).fill(0).map((_, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <React.Fragment key={i}>
                <Box as="span" mr="20px" w="60px" textAlign="center">
                  Web3.0
                </Box>
                <Box as="span" mr="20px" w="60px" textAlign="center">
                  Mail3
                </Box>
              </React.Fragment>
            ))}
          </Flex>
          <Flex minW="100vh" justify="space-between">
            {new Array(30).fill(0).map((_, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <React.Fragment key={i}>
                <Box as="span" mr="20px" w="60px" textAlign="center">
                  Web3.0
                </Box>
                <Box as="span" mr="20px" w="60px" textAlign="center">
                  Mail3
                </Box>
              </React.Fragment>
            ))}
          </Flex>
        </RollingSubtitles>
      </Box>
      <Flex
        w="full"
        position="relative"
        maxW={`${CONTAINER_MAX_WIDTH}px`}
        mx="auto"
        direction="column"
        align="center"
        pt="25%"
        pb="32px"
      >
        <Box
          w="calc(100% - 120px)"
          h="auto"
          mt="32px"
          mx="auto"
          position="relative"
          bg="#e7e7e7"
          rounded="6px"
        >
          <Icon
            as={EnvelopeBgSvg}
            w="full"
            h="auto"
            transform="translateY(-95%)"
            overflow="hidden"
            position="relative"
            mb="-52%"
          />
          <Box
            bg="#fff"
            w="calc(100% - 90px)"
            h="100vh"
            minH="100%"
            shadow="0 0 20px rgba(0, 0, 0, 0.15)"
            rounded="24px"
            position="relative"
            mt="-32%"
            mx="auto"
            top="0"
          />
          <Icon
            as={EnvelopeBottomCoverSvg}
            w="full"
            h="auto"
            bottom="-1%"
            left="0"
            position="absolute"
            transform="scale(1.035)"
          />
        </Box>
      </Flex>
      <Center w="full" h="472px" bg="#000" color="#fff" px="20px">
        <Flex
          w="full"
          maxW={`${CONTAINER_MAX_WIDTH}px`}
          h="472px"
          bg="#000"
          color="#fff"
          justify="center"
          py="30px"
        >
          <Flex direction="column" justify="space-between" w="60%" pr="70px">
            <Heading fontSize="96px" h="100px" mb="8px" whiteSpace="nowrap">
              Mail3 DAO
            </Heading>
            <Text fontSize="32px" lineHeight="36px" mb="32px" fontWeight="300">
              We are creating Mail3 DAO <br />
              for everyone rocket 🚀🚀🚀
            </Text>
            <Heading fontSize="36px">Join Now</Heading>
            <Stack
              direction="row"
              spacing="56px"
              fontWeight="500"
              fontSize="20px"
            >
              <Link href="#">
                <Icon as={TwitterIconSvg} w="40px" h="auto" />
              </Link>
              <Link href="#">
                <Icon as={MediumIconSvg} w="40px" h="auto" />
              </Link>
              <Link href="#">
                <Icon as={MirrorIconSvg} w="40px" h="auto" />
              </Link>
              <Link href="#">
                <Icon as={DiscordIconSvg} w="40px" h="auto" />
              </Link>
            </Stack>
          </Flex>
          <Icon as={Illustration2Svg} w="40%" h="auto" />
        </Flex>
      </Center>
      <Flex direction="column" position="relative" h="340px">
        <Image
          src={HomeGridBgBottomSvgPath}
          w="full"
          h="full"
          objectFit="cover"
          objectPosition="center bottom"
          position="absolute"
          top="0"
          left="0"
        />
        <Heading textAlign="center" fontSize="48px" mt="48px" mb="32px">
          Ecosystem
        </Heading>
        <Flex
          justify="space-between"
          mx="auto"
          maxW={`${CONTAINER_MAX_WIDTH}px`}
          w="full"
          fontSize="32px"
        >
          <Box>Chain</Box>
          <Box>Wallet</Box>
          <Box>Domain names</Box>
          <Box>Dapps</Box>
        </Flex>
      </Flex>
      <Flex
        direction="column"
        align="center"
        justify="center"
        maxW={`${CONTAINER_MAX_WIDTH}px`}
        w="full"
        h="358px"
        mx="auto"
      >
        <Heading fontSize="48px">Now，hit the whitelist of Mail3 </Heading>
        <LogoAnimation w="270px" mt="7px" />
        <Button w="176px" mt="40px">
          OK，Get in
        </Button>
      </Flex>
      <Center h="352px" bg="#000" color="#fff">
        <Flex w="full" maxW={`${CONTAINER_MAX_WIDTH}px`} justify="space-around">
          <Box>
            <Icon as={LogoWithWhiteFontColorSvg} w="275px" h="auto" />
            <Box fontSize="24px" letterSpacing="0.04em">
              For all crytpo natives
            </Box>
          </Box>
          <Stack direction="row" w="500px" justify="space-between">
            <Box>
              <Heading fontSize="18px">Community</Heading>
              <Stack mt="24px" spacing="20px" color="#F3F3F3" fontSize="16px">
                <Link href="#" display="flex" alignItems="center">
                  <Icon as={TwitterIconSvg} w="20px" h="auto" mr="10px" />
                  Twitter
                </Link>
                <Link href="#" display="flex" alignItems="center">
                  <Icon as={DiscordIconSvg} w="20px" h="auto" mr="10px" />
                  Discord
                </Link>
              </Stack>
            </Box>
            <Box>
              <Heading fontSize="18px">Social Media</Heading>
              <Stack mt="24px" spacing="20px" color="#F3F3F3" fontSize="16px">
                <Link href="#" display="flex" alignItems="center">
                  <Icon as={MirrorIconSvg} w="20px" h="auto" mr="10px" />
                  Mirror
                </Link>
                <Link href="#" display="flex" alignItems="center">
                  <Icon as={MediumIconSvg} w="20px" h="auto" mr="10px" />
                  Medium
                </Link>
              </Stack>
            </Box>
            <Box>
              <Heading fontSize="18px">Community</Heading>
              <Stack mt="24px" spacing="20px" color="#F3F3F3" fontSize="16px">
                <Box>Contact US</Box>
              </Stack>
            </Box>
          </Stack>
        </Flex>
      </Center>
    </Flex>
  )
}
