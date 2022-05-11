import styled from '@emotion/styled'
import { Box, Flex } from '@chakra-ui/react'
import React from 'react'

export const RollingSubtitlesWithAnimation = styled(Box)`
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

export const RollingSubtitles = () => (
  <Box bg="#000" h="44px" overflow="hidden" position="relative">
    <RollingSubtitlesWithAnimation lineHeight="44px" fontWeight="bold">
      <Flex minW="100vh" justify="space-between">
        {new Array(30).fill(0).map((_, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <React.Fragment key={i}>
            <Box as="span" mr="20px" w="60px" textAlign="center">
              Web3.0
            </Box>
            <Box as="span" mr="20px" w="60px" textAlign="center">
              Mail3
            </Box>
          </React.Fragment>
        ))}
      </Flex>
      <Flex minW="100vh" justify="space-between">
        {new Array(30).fill(0).map((_, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <React.Fragment key={i}>
            <Box as="span" mr="20px" w="60px" textAlign="center">
              Web3.0
            </Box>
            <Box as="span" mr="20px" w="60px" textAlign="center">
              Mail3
            </Box>
          </React.Fragment>
        ))}
      </Flex>
    </RollingSubtitlesWithAnimation>
  </Box>
)
