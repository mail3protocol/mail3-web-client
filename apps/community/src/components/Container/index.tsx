import { Box, BoxProps, Center } from '@chakra-ui/react'
import { useLayoutStatus } from '../../hooks/useLayoutStatus'
import { HEADER_HEIGHT } from '../Header'

export const MAX_WIDTH = 1084

export interface ContainerProps extends BoxProps {
  containerBgColor?: string
}

export const Container: React.FC<ContainerProps> = ({
  children,
  containerBgColor,
  ...props
}) => {
  const { isHiddenHeader } = useLayoutStatus()
  return (
    <Center bgColor={containerBgColor || 'containerBackground'}>
      <Box
        maxW={`${MAX_WIDTH}px`}
        w="full"
        minH={isHiddenHeader ? `100vh` : `calc(100vh - ${HEADER_HEIGHT}px)`}
        p="20px"
        {...props}
      >
        {children}
      </Box>
    </Center>
  )
}
