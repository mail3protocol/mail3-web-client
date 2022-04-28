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
    rounded="24px"
    maxW="1220px"
    w="full"
    position="relative"
    transition="200ms"
    px="20px"
    my={{
      base: '0',
      md: '22px',
    }}
    pt={{
      base: '30px',
      md: '56px',
    }}
    flex={{
      base: 1,
      md: 0,
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
