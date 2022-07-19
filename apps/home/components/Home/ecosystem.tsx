import { Box, Flex, Heading, Image, Stack } from '@chakra-ui/react'
import { CONTAINER_MAX_WIDTH } from 'ui'
import React from 'react'
import HomeGridBgBottomSvgPath from '../../assets/svg/home-grid-bg-bottom.svg'

export const Ecosystem = () => (
  <Flex
    direction="column"
    position="relative"
    h={{
      base: '174px',
      md: '340px',
    }}
    px="20px"
  >
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
    <Heading
      textAlign="center"
      fontSize={{ base: '24px', md: '48px' }}
      mt="48px"
      mb="32px"
    >
      Ecosystem
    </Heading>
    <Stack
      direction="row"
      spacing={{ base: '24px', md: 'unset' }}
      justify={{ base: 'center', md: 'space-between' }}
      mx="auto"
      maxW={`${CONTAINER_MAX_WIDTH}px`}
      w="full"
      fontSize={{ base: '14px', md: '32px' }}
      whiteSpace="nowrap"
    >
      <Box>Chain</Box>
      <Box>Wallet</Box>
      <Box>Domain names</Box>
      <Box>Dapps</Box>
    </Stack>
  </Flex>
)
