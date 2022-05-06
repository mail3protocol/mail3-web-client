import { Image } from '@chakra-ui/react'
import styled from '@emotion/styled'

export const Mascot = styled(Image)`
  max-width: 164px;
  max-height: 226px;
  transition: 200ms;
  padding-top: 10px;
  @media (max-width: 930px) {
    max-width: 104px;
    max-height: 144px;
  }
`
