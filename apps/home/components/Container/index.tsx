import { Flex, FlexProps } from '@chakra-ui/react'
import React from 'react'

export const Container: React.FC<FlexProps> = ({ children, ...props }) => (
  <Flex
    direction="column"
    align="center"
    shadow={{
      base: 'none',
      md: '0 0 10px 4px rgba(25, 25, 100, 0.1)',
    }}
    borderTopRadius="24px"
    maxW="1220px"
    w="full"
    h="full"
    position="relative"
    transition="200ms"
    px="20px"
    flex={1}
    mt={{
      base: '0',
      md: '22px',
    }}
    minH={{
      base: '607px',
      md: '700px',
    }}
    {...props}
  >
    {children}
  </Flex>
)
