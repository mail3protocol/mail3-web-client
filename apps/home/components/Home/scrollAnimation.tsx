import React, { useEffect, useRef, useState } from 'react'
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
const SCROLL_STEPS = [600, 300, 300, 600, 600]

const letterPaddingTop =
  SCROLL_STEPS.slice(0, 4).reduce((acc, step) => acc + step, 0) +
  Math.floor(SCROLL_STEPS[4] / 2)

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

  const getBannerAnimationInfo = () => {
    const scrollProgressStep0 = getScrollProgress(0)
    const scrollProgressStep1 = getScrollProgress(1)
    const targetScale = 1 - Math.min(CONTAINER_MAX_WIDTH / width, 0.8)
    const scale = 1 - scrollProgressStep0 * targetScale
    const rotateX = Math.floor(scrollProgressStep1 * 90)
    const h =
      (measureContainerRef.current?.offsetHeight ?? height) - HEADER_BAR_HEIGHT
    const targetHeight = h - (h - width * ENVELOPE_RADIO) * scrollProgressStep0
    const scaleY = width < height ? targetHeight / h : 1
    return {
      bannerTransformValue: {
        scale,
        rotateX,
        scaleY,
      },
      bannerHeadingScaleY: width < height ? h / targetHeight : 1,
      bannerTransform: [
        `scale(${scale})`,
        `rotateX(${rotateX}deg)`,
        `scaleY(${scaleY})`,
      ].join(' '),
      isHiddenBanner: scrollProgressStep1 === 1,
      isZoomOutCompleted: scrollProgressStep0 === 1,
    }
  }
  const getEnvelopeAnimationInfo = (
    scaleBase: number,
    envelopeSize: {
      width: number
      height: number
    }
  ) => {
    const noOverflowProgress = getScrollProgress(2, { overflow: true })
    const scrollProgressStep3 = getScrollProgress(3)
    const scrollProgressStep4Overflow = getScrollProgress(4, { overflow: true })
    const scrollProgressStep4 = Math.min(
      Math.max(scrollProgressStep4Overflow, 0),
      1
    )
    const overflowProgress = Math.min(Math.max(noOverflowProgress, 0), 1)
    const rotateX = `rotateX(${overflowProgress * 90 + 270}deg)`
    const targetTranslateY =
      (height - HEADER_BAR_HEIGHT - envelopeSize.height) / 2
    const targetScale = envelopeSize.width / width
    const scaleDiff = Math.abs(scaleBase - targetScale)
    const s =
      scaleBase <= targetScale
        ? scaleBase + scrollProgressStep3 * scaleDiff
        : scaleBase - scrollProgressStep3 * scaleDiff
    const scale = `scale(${s})`
    const translateYPart1Value = (scrollProgressStep3 * targetTranslateY) / s
    const translateYPart2Value =
      (scrollProgressStep4 * (envelopeSize.height / 2)) / s
    const translateY = `translateY(${
      translateYPart1Value + translateYPart2Value
    }px)`
    return {
      envelopeTransform: [rotateX, scale, translateY].join(' '),
      envelopeTransformEnded: scrollProgressStep3 === 1,
      isHiddenEnvelope: noOverflowProgress < 0 || noOverflowProgress > 1,
      envelopeProgress: scrollProgressStep4,
      rollingBackgroundOpacity:
        1 - Math.min(Math.max(scrollProgressStep4Overflow - 0.5, 0), 1),
    }
  }
  const getEnvelopeSize = () => {
    const w = Math.min(width, CONTAINER_MAX_WIDTH) - (width > 768 ? 40 : 0)
    const h = ENVELOPE_RADIO * w
    return {
      height: h,
      width: w,
    }
  }

  const envelopeSize = getEnvelopeSize()
  const {
    bannerTransformValue,
    bannerHeadingScaleY,
    bannerTransform,
    isHiddenBanner,
    isZoomOutCompleted,
  } = getBannerAnimationInfo()
  const {
    envelopeTransform,
    envelopeTransformEnded,
    isHiddenEnvelope,
    envelopeProgress,
    rollingBackgroundOpacity,
  } = getEnvelopeAnimationInfo(bannerTransformValue.scale, envelopeSize)

  const fullScreenHeight = `calc(100vh - ${HEADER_BAR_HEIGHT}px)`
  const bannerChildrenProps = {
    transition: '50ms',
    style: {
      transform: `scaleY(${bannerHeadingScaleY})`,
    },
  }

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
                  bg="#fff"
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
                  rounded="100%"
                  style={{
                    opacity: isZoomOutCompleted ? 1 : 0,
                    transform: `rotateX(-90deg) translateZ(4px)`,
                  }}
                />
                <Banner
                  transition="50ms"
                  headingProps={bannerChildrenProps}
                  topContainerProps={bannerChildrenProps}
                  bottomContainerProps={bannerChildrenProps}
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
