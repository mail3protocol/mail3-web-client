import React, { useEffect, useMemo, useState } from 'react'
import { fromEvent, map } from 'rxjs'
import { Box, Center, Flex } from '@chakra-ui/react'
import { useInnerSize } from 'hooks'
import { CONTAINER_MAX_WIDTH } from 'ui'
import { Banner } from './banner'
import { Letter } from './letterContent'
import { Envelope } from './envelope'
import { HEADER_BAR_HEIGHT } from './navbar'

const ENVELOPE_RADIO = 95 / 157
const SCROLL_STEPS = [200, 200, 200, 400, 400]

export const ScrollAnimation: React.FC = () => {
  const [scrollY, setScrollY] = useState(0)
  const { width, height } = useInnerSize()
  function getScrollProgress(
    step: number,
    options?: {
      overflow?: boolean
    }
  ) {
    const offset =
      step > 0
        ? SCROLL_STEPS.slice(0, step).reduce((acc, cur) => acc + cur, 0)
        : 0
    const offsetedScrollY = scrollY - offset
    return options?.overflow
      ? offsetedScrollY / SCROLL_STEPS[step]
      : Math.max(Math.min(offsetedScrollY / SCROLL_STEPS[step], 1), 0)
  }

  useEffect(() => {
    const subscriber = fromEvent(window, 'scroll')
      .pipe(map(() => window.scrollY))
      .subscribe(setScrollY)
    document.body.style.overflowX = 'hidden'
    return () => {
      document.body.style.overflowX = ''
      subscriber.unsubscribe()
    }
  }, [])

  const { bannerTransform, isHiddenBanner } = useMemo(() => {
    const scrollProgressStep1 = getScrollProgress(1)
    const scale = `scale(${1 - getScrollProgress(0) * 0.2})`
    const rotateX = `rotateX(${scrollProgressStep1 * 90}deg)`
    return {
      bannerTransform: [scale, rotateX].join(' '),
      isHiddenBanner: scrollProgressStep1 === 1,
    }
  }, [scrollY])

  const letterSize = useMemo(() => {
    const w = Math.min(width, CONTAINER_MAX_WIDTH) - (width > 768 ? 40 : 0)
    const h = ENVELOPE_RADIO * w
    return {
      height: h,
      width: w,
    }
  }, [width, height])

  const { envelopeTransform } = useMemo(() => {
    const rotateX = `rotateX(${getScrollProgress(2) * 90 + 270}deg)`
    const scaleBase = 0.8
    const targetTranslateY =
      (height - HEADER_BAR_HEIGHT - letterSize.height) / 2 +
      letterSize.height / 2
    const targetScale = letterSize.width / width
    const scaleDiff = Math.abs(scaleBase - targetScale)
    const p = getScrollProgress(3)
    const s =
      scaleBase <= targetScale
        ? scaleBase + p * scaleDiff
        : scaleBase - p * scaleDiff
    const scale = `scale(${s})`
    const translateY = `translateY(${(p * targetTranslateY) / s}px)`
    return { envelopeTransform: [rotateX, scale, translateY].join(' ') }
  }, [scrollY, width, height, letterSize.width, letterSize.height])

  const fullScreenHeight = `calc(100vh - ${HEADER_BAR_HEIGHT}px)`

  return (
    <Box
      position="relative"
      h="auto"
      minH={fullScreenHeight}
      w="full"
      style={{
        marginBottom: `${Math.floor(letterSize.height / 2) + 20}px`,
      }}
    >
      <Box position="absolute" top="0" left="0" w="full" h="full" zIndex={3}>
        <Flex w="100%" position="sticky" top={`${HEADER_BAR_HEIGHT}px`}>
          <Center
            position="relative"
            zIndex={1}
            h={fullScreenHeight}
            w="100vw"
            overflow="hidden"
          >
            <Box
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
                transition="50ms"
                style={{
                  transform: bannerTransform,
                  opacity: isHiddenBanner ? 0 : 1,
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
                <Banner />
              </Box>
            </Box>
          </Center>
        </Flex>
      </Box>
      <Envelope
        envelopeTransform={envelopeTransform}
        progress={getScrollProgress(4)}
        fullScreenHeight={fullScreenHeight}
      />
      <Letter
        style={{
          paddingTop: `calc(${1200 - letterSize.height / 2}px + 100vh)`,
          opacity: scrollY > 1000 ? 1 : 0,
        }}
        containerProps={{
          paddingBottom: `${Math.max(
            Math.floor(letterSize.height / 2),
            200
          )}px`,
        }}
      />
    </Box>
  )
}
