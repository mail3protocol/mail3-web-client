import { Button, ButtonProps } from '@chakra-ui/react'

export const ButtonBase: React.FC<ButtonProps> = ({ children, ...props }) => (
  <Button
    variant="unstyled"
    w="24px"
    minW="24px"
    h="24px"
    display="flex"
    justifyContent="center"
    alignContent="center"
    {...props}
  >
    {children}
  </Button>
)
