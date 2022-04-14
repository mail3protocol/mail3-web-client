import { Button as RawButton, ButtonProps } from '@chakra-ui/react'

export const Button: React.FC<ButtonProps> = ({ children, ...props }) => (
  <RawButton
    variant="primary"
    bg="brand.500"
    color="white"
    borderRadius="40px"
    _hover={{
      bg: 'brand.50',
    }}
    boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
    {...props}
  >
    {children}
  </RawButton>
)

export type { ButtonProps }
