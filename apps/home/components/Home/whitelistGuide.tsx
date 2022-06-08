import { Button, CONTAINER_MAX_WIDTH, LogoAnimation } from 'ui'
import { Flex, Heading } from '@chakra-ui/react'
import React from 'react'
import NextLink from 'next/link'
import { TrackEvent, useTrackClick } from 'hooks'
import { TESTING_URL, WHITE_LIST_URL } from '../../constants/env'

export const WhitelistGuide = () => {
  const trackClickGetIn = useTrackClick(TrackEvent.HomeClickGetIn)
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      maxW={`${CONTAINER_MAX_WIDTH}px`}
      w="full"
      h="auto"
      pt={{ base: '100px', md: '164px' }}
      pb={{ base: '100px', md: '131px' }}
      mx="auto"
      textAlign={{ base: 'center', md: 'left' }}
    >
      <Heading fontSize={{ base: '24px', md: '48px' }}>
        Now, hit the Mail3 Beta
      </Heading>
      <LogoAnimation w="270px" mt="7px" />
      <NextLink href={TESTING_URL} passHref>
        <Button w="176px" mt="40px" onClick={() => trackClickGetIn()}>
          OK，Get in
        </Button>
      </NextLink>
    </Flex>
  )
}
