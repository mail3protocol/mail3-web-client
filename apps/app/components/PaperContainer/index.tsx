import { Box, BoxProps } from '@chakra-ui/react'
import { forwardRef } from 'react'
import { CONTAINER_MAX_WIDTH } from 'ui'

const PADDING_X = 20

export const PaperContainer = forwardRef<HTMLDivElement, BoxProps>(
  ({ children, ...props }, ref) => (
    <Box
      ref={ref}
      shadow={{ base: 'none', md: '0 0 10px 4px rgb(25 25 100 / 10%)' }}
      w={{
        base: 'full',
        md: `calc(100% - ${PADDING_X * 2}px)`,
      }}
      minH="80vh"
      rounded="24px"
      my="20px"
      py="24px"
      px={{ base: '20px', lg: '64px' }}
      mx="auto"
      maxW={`${CONTAINER_MAX_WIDTH - PADDING_X * 2}px`}
      transition="200ms"
      {...props}
    >
      {children}
    </Box>
  )
)
