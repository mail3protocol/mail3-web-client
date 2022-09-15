import { Flex } from '@chakra-ui/react'
import { useLayoutStatus } from '../../hooks/useLayoutStatus'
import { HEADER_HEIGHT } from '../Header'

export const SIDEBAR_WIDTH = 196

export const Sidebar: React.FC = () => {
  const { isHiddenHeader } = useLayoutStatus()
  return (
    <Flex
      w={`${SIDEBAR_WIDTH}px`}
      h="100vh"
      shadow="sidebar"
      position="fixed"
      top={isHiddenHeader ? '0' : `${HEADER_HEIGHT}px`}
      left="0"
      bg="sidebarBackground"
      {...(isHiddenHeader ? {} : { pt: `${HEADER_HEIGHT}px` })}
    />
  )
}
