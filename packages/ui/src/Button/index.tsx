import React from 'react'
import { Button as RawButton, ButtonProps } from '@chakra-ui/react'

export const Button: React.ForwardRefExoticComponent<ButtonProps> =
  React.forwardRef<any, ButtonProps>(({ children, variant, ...props }, ref) => {
    const isOutline = variant === 'outline'
    return (
      <RawButton
        ref={ref}
        variant={variant}
        colorScheme="primary"
        bg={isOutline ? 'transparent' : 'brand.500'}
        color={isOutline ? 'brand.500' : 'white'}
        borderColor="brand.500"
        borderRadius="40px"
        _hover={{
          bg: isOutline ? '#f5f5f5' : 'brand.500',
        }}
        {...props}
      >
        {children}
      </RawButton>
    )
  })

export type { ButtonProps }
