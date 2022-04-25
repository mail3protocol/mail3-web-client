import { Button as RawButton, ButtonProps } from '@chakra-ui/react'

export const Button: React.FC<ButtonProps> = ({
  children,
  variant,
  ...props
}) => {
  const isOutline = variant === 'outline'
  return (
    <RawButton
      variant={variant}
      colorScheme="primary"
      bg={isOutline ? 'transparent' : 'brand.500'}
      color={isOutline ? 'brand.500' : 'white'}
      borderColor="brand.500"
      borderRadius="40px"
      _hover={{
        bg: isOutline ? '' : 'brand.500',
      }}
      {...props}
    >
      {children}
    </RawButton>
  )
}

export type { ButtonProps }
