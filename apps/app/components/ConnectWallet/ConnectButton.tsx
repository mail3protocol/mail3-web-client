import {
  Box,
  ButtonProps,
  Flex,
  HStack,
  Image,
  Spacer,
  Spinner,
  Text,
  TextProps,
} from '@chakra-ui/react'
import React from 'react'
import { Button } from 'ui'

export interface ConnectButtonProps extends ButtonProps {
  text: string
  icon: React.ReactNode
  isConnected?: boolean
  href?: string
  textProps?: TextProps
}

export const generateIcon = (src: string, w = '24px') => (
  <Image src={src} width={w} height={w} />
)

export const ConnectButton: React.FC<ConnectButtonProps> = ({
  text,
  icon,
  isLoading,
  isConnected,
  onClick,
  href,
  textProps,
  ...props
}) => {
  const connectedIndicatorLightEl = isConnected ? (
    <Box w="8px" h="8px" bg="rgb(39, 174, 96)" borderRadius="50%" mr="4px" />
  ) : null
  const flexProps: any = href ? { as: 'a', href, target: '_blank' } : {}
  return (
    <Button
      variant="outline"
      w="250px"
      px="8px"
      minH="40px"
      {...props}
      onClick={isConnected ? undefined : onClick}
    >
      <Flex w="100%" alignItems="center" {...flexProps}>
        <HStack spacing="20px" alignItems="center">
          {icon}
          <Text {...textProps}>{text}</Text>
        </HStack>
        <Spacer />
        {isLoading ? <Spinner /> : connectedIndicatorLightEl}
      </Flex>
    </Button>
  )
}
