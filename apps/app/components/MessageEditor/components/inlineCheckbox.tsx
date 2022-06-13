import { Box, Button, ButtonProps } from '@chakra-ui/react'
import React from 'react'

export const InlineCheckbox: React.FC<
  ButtonProps & {
    checked?: boolean
    onChangeChecked?: (checked: boolean) => void
    activeBorderColor?: string
  }
> = ({ checked, onChangeChecked, activeBorderColor, children, ...props }) => (
  <Button
    variant="unstyled"
    p="0"
    rounded={{
      base: 0,
      md: '30px',
    }}
    border={`1px solid ${
      checked ? activeBorderColor || '#000000' : 'rgba(0, 0, 0, 0)'
    }`}
    h="24px"
    lineHeight="24px"
    w={{
      md: 'auto',
    }}
    textAlign="center"
    whiteSpace="nowrap"
    fontSize={{
      base: '9px',
      md: '12px',
    }}
    minW="unset"
    minH="unset"
    onClick={() => onChangeChecked?.(!checked)}
    _focus={{
      outline: 'none',
    }}
    {...props}
  >
    <Box px={{ base: '4px', md: '12px' }}>{children}</Box>
  </Button>
)
