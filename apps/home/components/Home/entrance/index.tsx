import { Flex, Box, Grid, Heading, FlexProps } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import LogoNoColor from 'assets/svg/logo-no-color.svg?url'
import { useInnerSize } from 'hooks'
import { sleep } from '../../../utils'

const MOBILE_SIZE = 768

const BoxStyled = styled(Box)`
  width: 100%;
  height: 100%;
  position: relative;
  cursor: pointer;
  &::before {
    content: ' ';
    display: block;
    width: 100%;
    height: 100%;
    background-color: #000;
    transform: scale(0.16);
    transition: 2000ms;
    @media (max-width: ${MOBILE_SIZE}px) {
      transform: scale(0.22);
    }
  }
  &::after {
    content: ' ';
    display: block;
    width: 100%;
    height: 100%;
    background-image: url(${LogoNoColor});
    background-repeat: no-repeat;
    background-size: 80%;
    background-position: center;
    opacity: 0;
    z-index: 1;
    position: absolute;
    top: 0;
    left: 0;
    filter: invert(100%);
  }
  &:hover::after {
    animation: 2s show-envelope forwards;
  }
  &:hover::before {
    transform: scale(1);
    transition: 300ms;
  }

  @keyframes show-envelope {
    0%,
    90% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`

export type EntranceStatus = 'opened' | 'closing' | 'closed'

export const Entrance: React.FC<
  FlexProps & {
    onChangeStatus?: (status: EntranceStatus) => void
  }
> = ({ onChangeStatus, ...props }) => {
  const { width, height } = useInnerSize()
  const [status, setStatus] = useState<EntranceStatus>('opened')
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])
  useEffect(() => {
    onChangeStatus?.(status)
  }, [status])
  const [coverInfo, setCoverInfo] = useState<{
    clientX: number
    clientY: number
    isOpen: boolean
  }>({
    clientX: -1,
    clientY: -1,
    isOpen: false,
  })

  if (status === 'closed') {
    return null
  }

  return (
    <Flex
      position="fixed"
      h="100vh"
      w="full"
      top="0"
      left="0"
      bg="rgba(255, 255, 255, 1)"
      zIndex={999}
      display="flex"
      justify="center"
      align="center"
      overflowX="hidden"
      overflowY="auto"
      py="30px"
      opacity={status === 'closing' ? 0 : 1}
      transition="500ms"
      {...props}
    >
      <Flex direction="column" justify="center" align="center">
        <Grid
          templateColumns={{
            base: 'repeat(8, 45px)',
            md: 'repeat(13, 60px)',
            xl: 'repeat(19, 60px)',
          }}
          templateRows={{
            base: 'repeat(9, 45px)',
            md: 'repeat(8, 60px)',
          }}
          overflow="hidden"
          onClick={async (e) => {
            await setCoverInfo({
              clientX: e.clientX,
              clientY: e.clientY,
              isOpen: true,
            })
            await sleep(500)
            await setStatus('closing')
            await sleep(500)
            await setStatus('closed')
          }}
        >
          {new Array(9 * 19)
            .fill(0)
            .map((_, i) => i)
            .map((i) => (
              <BoxStyled key={i} />
            ))}
        </Grid>
        <Box
          position="absolute"
          top="0"
          left="0"
          w="full"
          h="full"
          overflow="hidden"
          pointerEvents="none"
          zIndex={2}
        >
          <Box
            position="absolute"
            top={`${coverInfo.clientY - 110}px`}
            left={`${coverInfo.clientX - 50}px`}
            w="100px"
            h="100px"
            bg="#000"
            style={{
              transition: coverInfo.isOpen ? 'transform 500ms' : '0',
              transformOrigin: 'center',
              transform: coverInfo.isOpen
                ? `scale(${Math.max(height, width) / 50})`
                : `scale(0)`,
            }}
          />
        </Box>
        <Heading
          pl="20px"
          w="full"
          fontSize={{ base: '24px', md: '36px', lg: '48px' }}
          lineHeight={{ base: '24px', md: '36px', lg: '64px' }}
          transition="200ms"
        >
          <Box whiteSpace="nowrap">Communicate with everyone</Box>
          <Box whiteSpace="nowrap">in web3</Box>
        </Heading>
      </Flex>
    </Flex>
  )
}
