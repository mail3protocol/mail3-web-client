import React, { useEffect, useMemo, useState } from 'react'
import { fromEvent, map } from 'rxjs'
import { Box, Center, Flex, Image } from '@chakra-ui/react'
import { useInnerSize } from 'hooks'
import { CONTAINER_MAX_WIDTH } from 'ui'
import { Banner, HIDDEN_SCROLL_Y } from './banner'
import EnvelopeBgPath from '../../assets/png/envelope/bg.png'
import EnvelopeCoverClosePath from '../../assets/png/envelope/cover-close.png'
import EnvelopeCoverOpenPath from '../../assets/png/envelope/cover-open.png'

const ENVELOPE_RADIO = 95 / 157

export const ScrollAnimation: React.FC = () => {
  const [scrollY, setScrollY] = useState(0)
  const { width, height } = useInnerSize()
  useEffect(() => {
    const subscriber = fromEvent(window, 'scroll')
      .pipe(map(() => window.scrollY))
      .subscribe(setScrollY)
    return () => {
      subscriber.unsubscribe()
    }
  }, [])
  const bannerTransform = useMemo(() => {
    const scale = `scale(${1 - Math.min(scrollY, 200) / 1000})`
    if (scrollY <= 200) {
      return scale
    }
    const rotateX = `rotateX(${Math.min((scrollY - 200) / 2, 90)}deg)`
    return [scale, rotateX].join(' ')
  }, [scrollY])
  const bannerHeight = useMemo(() => {
    const currentHeight = height - 60
    if (width > height) {
      return `${currentHeight}px`
    }
    const p = Math.max(Math.min(scrollY / 200, 1), 0)
    const targetHeight = ENVELOPE_RADIO * width
    const diff = currentHeight - targetHeight
    return `${Math.floor(currentHeight - diff * p)}px`
  }, [scrollY, width, height])
  const letterTransform = useMemo(() => {
    const rotateXValue =
      scrollY > 382 ? Math.min((scrollY - 382) / 2, 90) + 270 : 270
    const rotateX = `rotateX(${rotateXValue}deg)`
    const scaleBase = 0.8
    if (scrollY < 570) {
      return `scale(${scaleBase}) ${rotateX}`
    }
    const targetWidth =
      Math.min(width, CONTAINER_MAX_WIDTH) - (width > 768 ? 40 : 0)
    const targetHeight = ENVELOPE_RADIO * targetWidth
    const translateYValue = height / 2
    const targetScale = targetWidth / width
    const scaleDiff = Math.abs(scaleBase - targetScale)
    const p = Math.min((scrollY - 570) / 400, 1)
    const changedScale = Math.min(p, scaleDiff, scaleDiff)
    const s =
      scaleBase <= targetScale
        ? scaleBase + changedScale
        : scaleBase - changedScale
    // console.log(scrollY, targetHeight, translateYValue, p)
    return `scale(${s}) translateY(${p * translateYValue}px) ${rotateX}`
  }, [scrollY, width, height])
  const {
    envelopeCoverCloseRotateX,
    envelopeCoverOpenRotateX,
    hiddenCoverClose,
  } = useMemo(() => {
    const coverCloseRotateX =
      scrollY > 970 ? Math.floor(Math.min((scrollY - 970) / 200, 1) * 82) : 0
    const coverOpenRotateX =
      scrollY > 1170
        ? 90 - Math.floor(Math.min((scrollY - 1170) / 200, 1) * 90)
        : 0

    return {
      envelopeCoverCloseRotateX: coverCloseRotateX,
      envelopeCoverOpenRotateX: coverOpenRotateX,
      hiddenCoverClose: coverCloseRotateX >= 82,
    }
  }, [scrollY])

  return (
    <Box
      position="relative"
      h={`${height - 60 + HIDDEN_SCROLL_Y + 3000}px`}
      w="full"
    >
      <Flex w="100%" position="sticky" top="60px" zIndex={2}>
        <Center position="relative" zIndex={1} h="calc(100vh - 60px)" w="100vw">
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

        {/* 👇 Letter */}
        <Box
          w="100vw"
          h="calc(100vh - 60px)"
          position="absolute"
          zIndex={2}
          bg="#fff"
          top={0}
          left={0}
          style={{
            opacity: scrollY > 382 ? 1 : 0,
            perspective: 2000,
          }}
        >
          <Center
            transition="50ms"
            style={{
              transform: letterTransform,
            }}
            w="full"
            h="full"
            position="relative"
          >
            <Box
              position="relative"
              bg="#e7e7e7"
              shadow="0 0 20px rgba(0, 0, 0, 0.1)"
              borderBottomRadius="12px"
              w="full"
            >
              <Image src={EnvelopeBgPath.src} w="full" h="auto" />
              <Box
                w="full"
                h="auto"
                position="absolute"
                top="0"
                left="0"
                style={{
                  perspective: scrollY > 970 ? 2000 : undefined,
                }}
              >
                <Image
                  src={EnvelopeCoverClosePath.src}
                  w="full"
                  h="auto"
                  transformOrigin="top"
                  style={{
                    opacity: hiddenCoverClose ? 0 : 1,
                    transform: `rotateX(${envelopeCoverCloseRotateX}deg)`,
                  }}
                />
              </Box>
              <Box
                w="full"
                h="auto"
                position="absolute"
                top="2px"
                left="0"
                style={{
                  perspective: scrollY > 1170 ? 2000 : undefined,
                }}
              >
                <Image
                  src={EnvelopeCoverOpenPath.src}
                  w="full"
                  h="auto"
                  position="absolute"
                  bottom="100%"
                  left="0"
                  transformOrigin="bottom"
                  style={{
                    transform: `rotateX(-${envelopeCoverOpenRotateX}deg)`,
                    opacity: scrollY > 1170 ? 1 : 0,
                  }}
                />
              </Box>
            </Box>
          </Center>
        </Box>
        {/* TODO: 👇 LetterBackground */}
      </Flex>
    </Box>
  )
}
