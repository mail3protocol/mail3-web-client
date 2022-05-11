import { Button, CONTAINER_MAX_WIDTH, LogoAnimation } from 'ui'
import { Flex, Heading } from '@chakra-ui/react'
import React from 'react'

export const WhitelistGuide = () => (
  <Flex
    direction="column"
    align="center"
    justify="center"
    maxW={`${CONTAINER_MAX_WIDTH}px`}
    w="full"
    h="358px"
    mx="auto"
    textAlign={{ base: 'center', md: 'left' }}
  >
    <Heading fontSize={{ base: '24px', md: '48px' }}>
      Now，hit the whitelist of Mail3{' '}
    </Heading>
    <LogoAnimation w="270px" mt="7px" />
    <Button w="176px" mt="40px">
      OK，Get in
    </Button>
  </Flex>
)
