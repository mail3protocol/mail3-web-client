import { VStack, StackProps } from '@chakra-ui/react'

export const SidebarMenu: React.FC<StackProps> = ({ children, ...props }) => (
  <VStack spacing="10px" w="full" {...props}>
    {children}
  </VStack>
)
