import {
  Center,
  HStack,
  StackProps,
  Text,
  Box,
  CenterProps,
} from '@chakra-ui/react'
import styled from '@emotion/styled'
import React from 'react'

export const TabsContainer = styled(HStack)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  border-bottom: 1px solid #f3f3f3;

  @media (max-width: 600px) {
    border-bottom: none;
  }
`

export const Tabs: React.FC<StackProps> = ({ children, ...props }) => (
  <TabsContainer spacing="10%" {...props}>
    {children}
  </TabsContainer>
)

export interface TabProps extends CenterProps {
  isActive: boolean
}

export const Tab: React.ForwardRefExoticComponent<TabProps> = React.forwardRef<
  any,
  TabProps
>(({ isActive, children, ...props }, ref) => (
  <Center
    flexDirection="column"
    cursor="pointer"
    fontWeight={isActive ? 700 : undefined}
    fontSize={['14px', '14px', '20px']}
    ref={ref}
    {...props}
  >
    <Text mb="10px">{children}</Text>
    <Box
      w="46px"
      h="4px"
      visibility={isActive ? undefined : 'hidden'}
      borderRadius="32px"
      bg="black"
    />
  </Center>
))
