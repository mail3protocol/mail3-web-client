import { Button, CONTAINER_MAX_WIDTH, LogoAnimation } from 'ui'
import { Flex, Heading } from '@chakra-ui/react'
import React from 'react'
import NextLink from 'next/link'
import { WHITE_LIST_URL } from '../../constants/env'

export const WhitelistGuide = () => (
  <Flex
    direction="column"
    align="center"
    justify="center"
    maxW={`${CONTAINER_MAX_WIDTH}px`}
    w="full"
    h="auto"
    pt="102px"
    pb={{ base: '102px', md: '130px' }}
    mx="auto"
    textAlign={{ base: 'center', md: 'left' }}
  >
    <Heading fontSize={{ base: '24px', md: '48px' }}>
      Now, hit the whitelist of Mail3
    </Heading>
    <LogoAnimation w="270px" mt="7px" />
    <NextLink href={WHITE_LIST_URL}>
      <Button w="176px" mt="40px">
        OK，Get in
      </Button>
    </NextLink>
  </Flex>
)
