import { Box } from '@chakra-ui/react'
import styled from '@emotion/styled'

export const CONTAINER_MAX_WIDTH = 1220

export const PageContainer = styled(Box)`
  margin: 0 auto;
  max-width: ${CONTAINER_MAX_WIDTH}px;
  padding: 0 20px;
`
