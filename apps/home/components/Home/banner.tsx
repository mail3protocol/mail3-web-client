import {
  Box,
  Flex,
  FlexProps,
  Heading,
  Icon,
  Image,
  Center,
} from '@chakra-ui/react'
import { CONTAINER_MAX_WIDTH } from 'ui'
import React from 'react'
import HomeGridBgSvgPath from '../../assets/svg/home-grid-bg.svg?url'
import Illustration1Svg from '../../assets/svg/illustration/1.svg'
import Illustration1Png from '../../assets/png/illustration/1.png'
import Illustration3Png from '../../assets/png/illustration/3.png'
import { HEADER_BAR_HEIGHT } from './navbar'

export const Banner: React.FC<FlexProps> = ({ ...props }) => (
  <Flex
    direction="column"
    align="center"
    h={`calc(100vh - ${HEADER_BAR_HEIGHT}px)`}
    position="relative"
    px="20px"
    zIndex={0}
    bg="#fff"
    transform="translate3d(0, 0, 0)"
    overflow="hidden"
    {...props}
  >
    <Image
      src={HomeGridBgSvgPath}
      objectFit="cover"
      objectPosition="center bottom"
      w="100vw"
      h="100vh"
      position="absolute"
    />
    <Flex
      direction="column"
      h="full"
      w="full"
      maxW={`${CONTAINER_MAX_WIDTH}px`}
      position="relative"
    >
      <Box
        position="absolute"
        transform="translateY(104px)"
        w="100vw"
        h="100vh"
        bottom="0"
      >
        <Icon
          w="150px"
          as={Illustration1Svg}
          h="auto"
          position="absolute"
          top="5%"
          left="5%"
        />
        <Image
          src={Illustration1Png.src}
          w="150px"
          h="auto"
          position="absolute"
          top="5%"
          right="20%"
        />
      </Box>
      <Image
        src={Illustration3Png.src}
        position="absolute"
        w="120px"
        bottom="20%"
        left="0"
      />
      <Center position="relative" w="full" my="auto" flex={1}>
        <Heading
          fontSize={{ base: '24px', md: '48px' }}
          textAlign="center"
          lineHeight={{ base: '30px', md: '60px' }}
        >
          Crypto native generation
          <br />
          deserve a better mail protocol
        </Heading>
      </Center>
    </Flex>
  </Flex>
)
