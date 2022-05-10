import styled from '@emotion/styled'
import { Box } from '@chakra-ui/react'

export const RollingSubtitles = styled(Box)`
  animation: rollingSubtitleRun 60s infinite linear;
  position: absolute;
  display: flex;
  width: auto;
  height: 100%;
  color: #fff;
  white-space: nowrap;

  @keyframes rollingSubtitleRun {
    0% {
      transform: translateX(0);
    }

    100% {
      transform: translateX(-50%);
    }
  }
`
