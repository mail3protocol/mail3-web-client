import React, { useEffect, useMemo, useRef, useState } from 'react'
import { fromEvent, map } from 'rxjs'
import { Box, BoxProps, Center, Flex } from '@chakra-ui/react'
import { useInnerSize } from 'hooks'
import { CONTAINER_MAX_WIDTH } from 'ui'
import { Banner } from './banner'
import { Letter } from './letterContent'
import { Envelope } from './envelope'
import { HEADER_BAR_HEIGHT } from './navbar'
import { RollingBackground } from './rollingSubtitles'

const ENVELOPE_RADIO = 95 / 157
const SCROLL_STEPS = [300, 300, 300, 600, 600]

const letterPaddingTop =
  SCROLL_STEPS.slice(0, -1).reduce((acc, step) => acc + step, 0) +
  Math.floor(SCROLL_STEPS[SCROLL_STEPS.length - 1] / 2)

const scrollStepIndexMap = SCROLL_STEPS.reduce<{
  [key: number]: number
}>((acc, step, index) => {
  if (index === 0) {
    acc[index] = 0
  } else {
    acc[index] = SCROLL_STEPS.slice(0, index).reduce((sum, cur) => sum + cur, 0)
  }
  return acc
}, {})

export const ScrollAnimation: React.FC<BoxProps> = ({ ...props }) => {
  const [scrollY, setScrollY] = useState(0)
  const { width, height } = useInnerSize()
  function getScrollProgress(
    step: number,
    options?: {
      overflow?: boolean
    }
  ) {
    const offset = scrollStepIndexMap[step]
    const offsetedScrollY = scrollY - offset
    return options?.overflow
      ? offsetedScrollY / SCROLL_STEPS[step]
      : Math.max(Math.min(offsetedScrollY / SCROLL_STEPS[step], 1), 0)
  }

  const measureContainerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const subscriber = fromEvent(window, 'scroll')
      .pipe(map(() => window.scrollY))
      .subscribe((y) => {
        setScrollY(y)
        document.body.style.overflowX = 'hidden'
        if (window.scrollX !== 0) {
          window.scroll(0, y)
        }
      })
    return () => {
      document.body.style.overflowX = ''
      subscriber.unsubscribe()
    }
  }, [])

  const { bannerTransform, isHiddenBanner } = useMemo(() => {
    const scrollProgressStep1 = getScrollProgress(1)
    const scale = `scale(${1 - getScrollProgress(0) * 0.2})`
    const rotateX = `rotateX(${Math.floor(scrollProgressStep1 * 90)}deg)`
    return {
      bannerTransform: [scale, rotateX].join(' '),
      isHiddenBanner: scrollProgressStep1 === 1,
    }
  }, [scrollY])

  const envelopeSize = useMemo(() => {
    const w = Math.min(width, CONTAINER_MAX_WIDTH) - (width > 768 ? 40 : 0)
    const h = ENVELOPE_RADIO * w
    return {
      height: h,
      width: w,
    }
  }, [width, height])

  const bannerHeight = useMemo(() => {
    const h = measureContainerRef.current?.offsetHeight ?? height
    return h - (h - width * ENVELOPE_RADIO) * getScrollProgress(0)
  }, [scrollY, width, height])

  const { envelopeTransform, envelopeTransformEnded, isHiddenEnvelope } =
    useMemo(() => {
      const noOverflowProgress = getScrollProgress(2, { overflow: true })
      const overflowProgress = Math.min(Math.max(noOverflowProgress, 0), 1)
      const rotateX = `rotateX(${overflowProgress * 90 + 270}deg)`
      const scaleBase = 0.8
      const targetTranslateY =
        (height - HEADER_BAR_HEIGHT - envelopeSize.height) / 2 +
        envelopeSize.height / 2
      const targetScale = envelopeSize.width / width
      const scaleDiff = Math.abs(scaleBase - targetScale)
      const p = getScrollProgress(3)
      const s =
        scaleBase <= targetScale
          ? scaleBase + p * scaleDiff
          : scaleBase - p * scaleDiff
      const scale = `scale(${s})`
      const translateY = `translateY(${(p * targetTranslateY) / s}px)`
      return {
        envelopeTransform: [rotateX, scale, translateY].join(' '),
        envelopeTransformEnded: p === 1,
        isHiddenEnvelope: noOverflowProgress < 0 || noOverflowProgress > 1,
      }
    }, [scrollY, width, height, envelopeSize.width, envelopeSize.height])

  const fullScreenHeight = `calc(100vh - ${HEADER_BAR_HEIGHT}px)`
  const { envelopeProgress, rollingBackgroundOpacity } = useMemo(() => {
    const scrollProgress4 = getScrollProgress(4)
    return {
      envelopeProgress: scrollProgress4,
      rollingBackgroundOpacity: 1 - scrollProgress4,
    }
  }, [scrollY])

  return (
    <Box
      position="relative"
      h="auto"
      minH={fullScreenHeight}
      w="full"
      {...props}
      style={{
        ...props.style,
        marginBottom: `${Math.floor(envelopeSize.height / 2) + 20}px`,
      }}
      zIndex={1}
    >
      <Box
        position="fixed"
        w="100vw"
        h="100vh"
        opacity="0"
        pointerEvents="none"
        ref={measureContainerRef}
      />
      <Box
        position="absolute"
        top="0"
        left="0"
        w="full"
        h="full"
        zIndex={0}
        style={{
          opacity: rollingBackgroundOpacity,
        }}
      >
        <Box w="full" position="sticky" top={`${HEADER_BAR_HEIGHT}px`}>
          <RollingBackground />
        </Box>
      </Box>
      <Box position="absolute" top="0" left="0" w="full" h="full" zIndex={3}>
        <Flex w="full" position="sticky" top={`${HEADER_BAR_HEIGHT}px`}>
          <Center
            position="relative"
            zIndex={1}
            h={fullScreenHeight}
            w="100vw"
            overflow="hidden"
          >
            <Center
              position="absolute"
              top="0"
              left="0"
              w="full"
              h="full"
              overflow="hidden"
              style={{
                perspective: 2000,
              }}
            >
              <Box
                w="full"
                transition="transform 50ms"
                style={{
                  transform: bannerTransform,
                  opacity: isHiddenBanner ? 0 : 1,
                  transformStyle: 'preserve-3d',
                }}
              >
                <Box
                  position="absolute"
                  top="-8px"
                  left="-8px"
                  w="calc(100% + 16px)"
                  h="calc(100% + 16px)"
                  zIndex={-1}
                  rounded="10px"
                  bgSize="80px"
                  transformOrigin="center"
                  border="8px solid transparent"
                  style={{
                    borderImage:
                      '8 repeating-linear-gradient(-45deg, #4E51F4 0, #4E51F4 1em, transparent 0, transparent 2em, #000 0, #000 3em, transparent 0, transparent 4em)',
                  }}
                />
                <Box
                  position="absolute"
                  bg="#eee"
                  w="calc(100% + 16px)"
                  h="8px"
                  bottom="-8px"
                  left="-8px"
                  transform="rotateX(-90deg) translateZ(4px)"
                  rounded="100%"
                />
                <Banner
                  willChange="height"
                  style={{
                    height: width < height ? `${bannerHeight}px` : undefined,
                  }}
                />
              </Box>
            </Center>
          </Center>
        </Flex>
      </Box>
      <Envelope
        envelopeTransformEnded={envelopeTransformEnded}
        envelopeTransform={envelopeTransform}
        progress={envelopeProgress}
        fullScreenHeight={fullScreenHeight}
        hiddenSide={isHiddenEnvelope}
      />
      <Letter
        style={{
          paddingTop: `calc(${
            letterPaddingTop - envelopeSize.height / 2
          }px + 100vh)`,
          opacity: scrollY > 1000 ? 1 : 0,
        }}
        containerProps={{
          paddingBottom: `${Math.max(
            Math.floor(envelopeSize.height / 2),
            200
          )}px`,
        }}
      />
    </Box>
  )
}
