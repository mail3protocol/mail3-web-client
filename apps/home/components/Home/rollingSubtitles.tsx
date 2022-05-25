import styled from '@emotion/styled'
import { Box, Flex, Stack } from '@chakra-ui/react'
import React from 'react'

export const RollingSubtitlesWithAnimation = styled(Box)`
  animation: ${(props: { reverse?: boolean }) =>
      props?.reverse ? 'rollingSubtitleRunReverse' : 'rollingSubtitleRun'}
    60s infinite linear;
  position: absolute;
  display: flex;
  width: auto;
  height: 100%;
  white-space: nowrap;

  @keyframes rollingSubtitleRun {
    0% {
      transform: translateX(0);
    }

    100% {
      transform: translateX(-50%);
    }
  }

  @keyframes rollingSubtitleRunReverse {
    0% {
      transform: translateX(-50%);
    }
    100% {
      transform: translateX(0);
    }
  }
`

export const RollingBackground = () => (
  <Box
    h="100vh"
    overflow="hidden"
    position="relative"
    fontWeight="bold"
    fontSize="120px"
    color="#E1E1E1"
  >
    {[false, true].map((isReverse) => (
      <RollingSubtitlesWithAnimation
        reverse={isReverse}
        key={isReverse.toString()}
      >
        <Stack
          spacing="300px"
          direction="column"
          transform={isReverse ? 'translateY(300px)' : ''}
        >
          {new Array(5)
            .fill(0)
            .map((_, i) => i)
            .map((stackItemIndex) => (
              <Flex
                w="auto"
                key={stackItemIndex}
                h="300px"
                minH="300px"
                lineHeight="300px"
              >
                {new Array(2)
                  .fill(0)
                  .map((_, i) => i)
                  .map((k) => (
                    <Box
                      minW="100vh"
                      key={k}
                      h="300px"
                      lineHeight="300px"
                      whiteSpace="pre"
                    >
                      {new Array(10).fill('   Web3.0      Mail3   ').join('')}
                    </Box>
                  ))}
              </Flex>
            ))}
        </Stack>
      </RollingSubtitlesWithAnimation>
    ))}
  </Box>
)

export const RollingSubtitles = () => (
  <Box
    bg="#000"
    h="44px"
    overflow="hidden"
    position="relative"
    color="#fff"
    fontSize="16px"
  >
    <RollingSubtitlesWithAnimation lineHeight="44px" fontWeight="bold">
      {new Array(2)
        .fill(0)
        .map((_, i) => i)
        .map((k) => (
          <Box minW="100vh" key={k} whiteSpace="pre">
            {new Array(10).fill('Web3.0      Mail3      ').join('')}
          </Box>
        ))}
    </RollingSubtitlesWithAnimation>
  </Box>
)
