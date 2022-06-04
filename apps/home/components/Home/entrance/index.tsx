import { Flex, Box, Grid, Heading, FlexProps, Icon } from '@chakra-ui/react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from '@emotion/styled'
import LogoNoColor from 'assets/svg/logo-no-color.svg?url'
import LogoSvg from 'assets/svg/logo.svg'
import { TrackEvent, useInnerSize, useTrackClick } from 'hooks'
import { debounceTime, delay, fromEvent } from 'rxjs'
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
    background-size: 50%;
    background-position: center;
    opacity: 0;
    z-index: 1;
    position: absolute;
    top: 0;
    left: 0;
    filter: invert(100%);
    transition: 300ms;
    transform: scale(0);
  }
  &:hover::after {
    animation: 300ms showAfterByOpacity forwards;
    animation-delay: 300ms;
  }
  &:hover::before {
    transform: scale(1);
    transition: 300ms;
  }
  @keyframes showAfterByOpacity {
    0% {
      opacity: 0;
      transform: scale(0.16);
    }
    100% {
      opacity: 1;
      transform: scale(1);
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
  const containerRef = useRef<HTMLDivElement>(null)
  const onClose = useCallback(async () => {
    await setStatus('closing')
    await sleep(500)
    await setStatus('closed')
  }, [])
  useEffect(() => {
    const el = containerRef.current as HTMLDivElement
    const scrollSubscriber = fromEvent(el, 'scroll')
      .pipe(debounceTime(300))
      .subscribe(async () => {
        if (el.scrollTop >= el.clientHeight) {
          await onClose()
        }
      })
    const touchendSubscriber = fromEvent(window, 'touchend')
      .pipe(delay(300))
      .subscribe(async () => {
        if (el.scrollTop + 200 >= el.clientHeight) {
          await onClose()
        }
      })
    const resizeSubscriber = fromEvent(window, 'resize').subscribe(async () => {
      if (window.innerWidth < 768) {
        await onClose()
      }
    })
    if (window.innerWidth < 768) {
      onClose()
    }
    return () => {
      scrollSubscriber.unsubscribe()
      touchendSubscriber.unsubscribe()
      resizeSubscriber.unsubscribe()
    }
  }, [])
  const trackBlackCube = useTrackClick(TrackEvent.HomeClickBlackCube)

  if (status === 'closed' || width < 768) {
    return null
  }

  const heading = (
    <Heading
      w="full"
      fontSize={{ base: '22px', md: '36px' }}
      lineHeight={{ base: '22px', md: '48px' }}
      textAlign={{ base: 'left', md: 'right' }}
      mt={{ base: '46px', md: '0' }}
    >
      Build valuable connections in the
      <br />
      decentralized society
    </Heading>
  )

  return (
    <Box
      w="100vw"
      h="100vh"
      overflow="hidden"
      position="fixed"
      top="0"
      left="0"
      scrollSnapType="y mandatory"
      zIndex={999}
      transition="opacity 500ms"
      opacity={{ base: 0, md: status === 'closing' ? 0 : 1 }}
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
        shadow="0 20px 50px rgba(0, 0, 0, 0.2)"
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
            <Icon
              as={LogoSvg}
              w={{ base: '100px', md: '170px' }}
              h="auto"
              mb="auto"
            />
            <Box w="auto" display={{ base: 'block', md: 'none' }}>
              {heading}
            </Box>
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
              trackBlackCube()
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
          <Flex
            justify="flex-end"
            w={{
              base: `${8 * 45}px`,
              md: `${13 * 60}px`,
              xl: `${20 * 60}px`,
            }}
            display={{
              base: 'none',
              md: 'flex',
            }}
            px={{ base: '15px', md: '20px' }}
          >
            {heading}
          </Flex>
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
    </Box>
  )
}
