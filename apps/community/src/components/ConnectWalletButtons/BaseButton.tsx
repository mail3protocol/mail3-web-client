import React, { forwardRef, ReactElement } from 'react'
import { Box, Button, ButtonProps, Image, Spinner } from '@chakra-ui/react'

export interface BaseButtonProps extends ButtonProps {
  icon: string | ReactElement
}

export const BaseButton = forwardRef<HTMLButtonElement, BaseButtonProps>(
  ({ children, icon, isDisabled, isLoading, ...props }, ref) => (
    <Button
      ref={ref}
      variant="wallet"
      isDisabled={isLoading || isDisabled}
      disabled={isLoading || isDisabled}
      w="246px"
      mx="auto"
      leftIcon={
        typeof icon === 'string' ? (
          <Image src={icon} alt="icon" w="24px" h="24px" />
        ) : (
          icon
        )
      }
      {...props}
      _disabled={{
        cursor: isLoading ? 'wait' : undefined,
        opacity: 0.4,
        shadow: 'none',
        ...(props?._disabled || {}),
      }}
    >
      {children}
      {isLoading ? (
        <Box as="span" ml="auto" alignSelf="center" w="24px" h="24px">
          <Spinner w="full" h="full" />
        </Box>
      ) : null}
    </Button>
  )
)
