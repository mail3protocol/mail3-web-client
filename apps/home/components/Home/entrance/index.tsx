import { Flex, Box, Grid, Heading, FlexProps, Icon } from '@chakra-ui/react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from '@emotion/styled'
import LogoNoColor from 'assets/svg/logo-no-color.svg?url'
import LogoSvg from 'assets/svg/logo.svg'
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

const DotContainerHeightRowCountMediasContent = new Array(15)
  .fill(0)
  .map(
    (x, i) =>
      `@media (max-height: ${1000 - 50 * i}px) { --row-count: ${15 - i}; }`
  )
  .join('\n')

export const DotContainer = styled(Grid)`
  --row-count: 15;
  ${DotContainerHeightRowCountMediasContent}
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
  const [scrollOpenProgress, setScrollOpenProgress] = useState(1)
  const containerRef = useRef<HTMLDivElement>(null)
  const onClose = useCallback(async () => {
    await setStatus('closing')
    await sleep(500)
    await setStatus('closed')
  }, [])
  useEffect(() => {
    const el = containerRef.current as HTMLDivElement
    const onScroll = async () => {
      setScrollOpenProgress(Math.min(el.scrollTop / el.clientHeight, 1))
      if (el.scrollTop === el.clientHeight) {
        await onClose()
      }
    }
    if (el) {
      el.addEventListener('scroll', onScroll)
    }
    return () => {
      if (el) {
        el.removeEventListener('scroll', onScroll)
      }
    }
  }, [])

  if (status === 'closed') {
    return null
  }

  return (
    <Box
      w="100vw"
      h="100vh"
      overflowX="hidden"
      overflowY={{ base: 'auto', md: 'hidden' }}
      position="fixed"
      top="0"
      left="0"
      scrollSnapType="y mandatory"
      zIndex={999}
      transition="opacity 500ms"
      opacity={status === 'closing' ? 0 : 1}
      ref={containerRef}
    >
      <Flex
        h="full"
        w="full"
        display="flex"
        justify="center"
        align="center"
        py="30px"
        scrollSnapAlign="center"
        bg="#fff"
        {...props}
      >
        <Flex
          direction="column"
          justify="center"
          align="center"
          w="auto"
          pointerEvents={{
            base: 'none',
            md: 'unset',
          }}
        >
          <Flex
            direction={{
              base: 'column',
              md: 'row',
            }}
            justify="space-between"
            px={{ base: '15px', md: '20px' }}
            w={{
              base: `${8 * 45}px`,
              md: `${13 * 60}px`,
              xl: `${20 * 60}px`,
            }}
          >
            <Icon as={LogoSvg} w="112px" h="auto" />
            <Heading
              w={{
                base: 'full',
                md: 'calc(100% - 112px)',
              }}
              fontSize={{ base: '22px', md: '36px', lg: '48px' }}
              lineHeight={{ base: '22px', md: '36px', lg: '64px' }}
              textAlign={{ base: 'left', md: 'right' }}
              mt={{ base: '46px', md: '0' }}
            >
              Build valuable connections in the decentralized society
            </Heading>
          </Flex>
          <DotContainer
            templateColumns={{
              base: 'repeat(8, 45px)',
              md: 'repeat(13, 60px)',
              xl: 'repeat(20, 60px)',
            }}
            templateRows={{
              base: 'repeat(var(--row-count), 45px)',
              md: 'repeat(min(var(--row-count), 9), 60px)',
            }}
            overflow="hidden"
            onClick={async (e) => {
              await setCoverInfo({
                clientX: e.clientX,
                clientY: e.clientY,
                isOpen: true,
              })
              await sleep(500)
              await onClose()
            }}
          >
            {new Array(9 * 20)
              .fill(0)
              .map((_, i) => i)
              .map((i) => (
                <BoxStyled key={i} />
              ))}
          </DotContainer>
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
        </Flex>
      </Flex>
      <Box
        position="fixed"
        top="-100vh"
        left="0"
        h="100vh"
        w="full"
        bg="#fff"
      />
      <Box
        w="full"
        h="100vh"
        bg="#000"
        scrollSnapAlign="center"
        transition="100ms"
        style={{ opacity: 1 - scrollOpenProgress }}
      />
    </Box>
  )
}
