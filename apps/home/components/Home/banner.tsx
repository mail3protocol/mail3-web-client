import {
  Box,
  Flex,
  FlexProps,
  Heading,
  Icon,
  Image,
  Center,
  HeadingProps,
} from '@chakra-ui/react'
import { CONTAINER_MAX_WIDTH } from 'ui'
import React from 'react'
import styled from '@emotion/styled'
import HomeGridBgSvgPath from '../../assets/svg/home-grid-bg.svg?url'
import Illustration1Svg from '../../assets/svg/illustration/1.svg'
import Illustration1Png from '../../assets/png/illustration/1.png'
import Illustration3Png from '../../assets/png/illustration/3.png'
import Illustration8Png from '../../assets/png/illustration/8.png'
import { HEADER_BAR_HEIGHT } from './navbar'

const Illustration8Image = styled(Image)`
  left: ${CONTAINER_MAX_WIDTH - 400}px;
  @media (max-width: ${CONTAINER_MAX_WIDTH}px) {
    left: 50vw;
  }
`

export interface BannerProps extends FlexProps {
  // innerWidth: number
  // innerHeight: number
  // changedHeight?: number
  headingProps?: HeadingProps
}

export const Banner: React.FC<BannerProps> = ({
  // innerWidth,
  // innerHeight,
  // changedHeight,
  headingProps,
  ...props
}) => {
  // const w = Math.min(innerWidth, CONTAINER_MAX_WIDTH)
  // const s = Math.max(w < 600 ? w / 300 - 1 : 1, 0.5)
  // const illustration1PngTransform = useMemo(() => {
  //   const scale = changedHeight ? Math.min(changedHeight / 150 / 4, 1) : 1
  //   const translateY = changedHeight
  //     ? innerHeight - changedHeight + 100 * scale
  //     : 0
  //   return `translateY(-${innerHeight - translateY}px) translateX(${Math.floor(
  //     w - 150 * s - 50 / s
  //   )}px) scale(${scale})`
  // }, [innerHeight, changedHeight, w, s])
  // const illustration8PngTransform = `translateX(${Math.floor(
  //   w - 400 * s - 50 / s
  // )}px) scale(${s})`
  console.log('banner render')
  return (
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
            left="0"
          />
          <Image
            src={Illustration1Png.src}
            w="auto"
            h="150px"
            position="absolute"
            bottom="5%"
            left="0"
          />
        </Box>
        <Image
          src={Illustration3Png.src}
          position="absolute"
          w="120px"
          bottom="10%"
          left="0"
        />
        <Illustration8Image
          src={Illustration8Png.src}
          position="absolute"
          w="400px"
          bottom="10%"
        />
        <Center position="relative" w="full" my="auto" flex={1}>
          <Heading
            fontSize={{ base: '24px', md: '48px' }}
            textAlign="center"
            lineHeight={{ base: '30px', md: '60px' }}
            {...headingProps}
          >
            Crypto native generation
            <br />
            deserve a better mail protocol
          </Heading>
        </Center>
      </Flex>
    </Flex>
  )
}
