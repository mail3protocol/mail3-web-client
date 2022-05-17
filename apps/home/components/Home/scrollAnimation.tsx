import React, { useEffect, useMemo, useState } from 'react'
import { fromEvent, map } from 'rxjs'
import { Box, Center, Flex, Icon } from '@chakra-ui/react'
import { useInnerSize } from 'hooks'
import { CONTAINER_MAX_WIDTH } from 'ui'
import { Banner, HIDDEN_SCROLL_Y } from './banner'
import EnvelopeBottomCoverSvg from '../../assets/svg/envelope-bottom-cover.svg'

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
  const letterTransform = useMemo(() => {
    const rotateXValue =
      scrollY > 382 ? Math.min((scrollY - 382) / 2, 90) + 270 : 270
    const rotateX = `rotateX(${rotateXValue}deg)`
    const scaleBase = 0.8
    if (scrollY < 570) {
      return `scale(${scaleBase}) ${rotateX}`
    }
    const maxW = Math.min(width, CONTAINER_MAX_WIDTH) - 40
    const targetScale = maxW / width
    const scaleDiff = Math.abs(scaleBase - targetScale)
    const changedScale = Math.min((scrollY - 570) / 400, scaleDiff, scaleDiff)
    const s =
      scaleBase <= targetScale
        ? scaleBase + changedScale
        : scaleBase - changedScale
    return `scale(${s}) ${rotateX}`
  }, [scrollY, width])

  return (
    <Box
      position="relative"
      h={`${height - 60 + HIDDEN_SCROLL_Y + 3000}px`}
      w="full"
    >
      <Flex w="200%" position="sticky" top="60px" zIndex={2}>
        <Box
          style={{
            transformStyle: 'preserve-3d',
            perspective: 2000,
          }}
          position="relative"
          zIndex={1}
        >
          <Box
            w="100vw"
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

        {/* 👇 Letter */}
        <Box
          w="100vw"
          h="calc(100vh - 60px)"
          position="relative"
          px="20px"
          zIndex={0}
          bg="#fff"
          transform="translateX(-100%)"
          style={{
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
            <Icon
              as={EnvelopeBottomCoverSvg}
              w="full"
              h="auto"
              transform="scale(1.035) translateY(1%)"
            />
          </Center>
        </Box>
      </Flex>
    </Box>
  )
}
