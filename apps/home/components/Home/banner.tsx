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

export const HIDDEN_SCROLL_Y = 382

export const Banner: React.FC<FlexProps> = ({ ...props }) => (
  <Flex
    direction="column"
    align="center"
    h="calc(100vh - 60px)"
    position="relative"
    px="20px"
    zIndex={0}
    bg="#fff"
    transform="translate3d(0, 0, 0)"
    {...props}
  >
    <Image
      src={HomeGridBgSvgPath}
      objectFit="cover"
      objectPosition="center bottom"
      w="full"
      h="full"
      position="absolute"
    />
    <Flex
      direction="column"
      h="full"
      w="full"
      maxW={`${CONTAINER_MAX_WIDTH}px`}
      position="relative"
    >
      <Box flex={1} position="relative" mt="28px">
        <Icon
          w="150px"
          as={Illustration1Svg}
          h="auto"
          position="absolute"
          top="0"
          left="0"
          transform={{
            base: 'unset',
            md: 'translateY(70px)',
          }}
        />
        <Image
          src={Illustration1Png.src}
          w={{ base: 'auto', md: '181px' }}
          h={{ base: 'full', md: 'auto' }}
          position="absolute"
          top="0"
          right="0"
          transform={{
            base: 'unset',
            md: 'translateY(70px)',
          }}
        />
      </Box>
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
      <Box flex={1} position="relative">
        <Image
          src={Illustration3Png.src}
          position="absolute"
          maxW="162px"
          w="20%"
          bottom="40px"
          left="-30px"
        />
      </Box>
    </Flex>
  </Flex>
)
