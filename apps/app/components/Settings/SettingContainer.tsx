import { Flex } from '@chakra-ui/react'
import styled from '@emotion/styled'
import { NAVBAR_GUTTER, NAVBAR_HEIGHT } from '../../constants'

export const SettingContainer = styled(Flex)`
  margin-top: ${NAVBAR_GUTTER}px;
  margin-bottom: 30px;
  border-radius: 24px;
  min-height: calc(100vh - ${NAVBAR_GUTTER + NAVBAR_HEIGHT + 30}px);
  background-color: white;
  box-shadow: 0px 0px 10px 4px rgba(25, 25, 100, 0.1);
  flex-direction: column;
  position: relative;
  @media (max-width: 930px) {
    border-radius: 0;
    box-shadow: none;

    .next-header {
      display: none;
    }
  }
`
