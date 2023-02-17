import { BoxProps, Flex, FlexProps } from '@chakra-ui/react'
import { LogoSubscription } from 'ui/src/Logo'

export const HEADER_HEIGHT = 60

export const Header: React.FC<
  FlexProps & {
    logoNameProps?: BoxProps
  }
> = ({ logoNameProps, children, ...props }) => (
  <Flex
    h={`${HEADER_HEIGHT}px`}
    w="full"
    px="20px"
    shadow="md"
    position="fixed"
    top="0"
    left="0"
    zIndex="header"
    bg="headerBackground"
    {...props}
  >
    <Flex align="center" userSelect="none">
      <LogoSubscription />
    </Flex>
    {children}
  </Flex>
)
