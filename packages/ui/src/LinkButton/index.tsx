import { Center, FlexProps } from '@chakra-ui/react'
import React from 'react'

export const LinkButton: React.ForwardRefExoticComponent<FlexProps> =
  React.forwardRef<any>(({ children, ...props }, ref) => (
    <Center as="a" {...props} ref={ref}>
      {children}
    </Center>
  ))
