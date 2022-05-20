import { Box, BoxProps, Center, Flex, Image } from '@chakra-ui/react'
import React, { useMemo } from 'react'
import EnvelopeBgPath from '../../assets/png/envelope/bg.png'
import EnvelopeCoverClosePath from '../../assets/png/envelope/cover-close.png'
import EnvelopeCoverOpenPath from '../../assets/png/envelope/cover-open.png'
import { HEADER_BAR_HEIGHT } from './navbar'

export const EnvelopeContainer: React.FC<
  BoxProps & {
    fullScreenHeight?: string
  }
> = ({ children, fullScreenHeight, ...props }) => (
  <Box position="absolute" w="full" h="full" top="0" left="0" {...props}>
    <Box
      w="full"
      h={fullScreenHeight ?? 'calc(100vh - 60px)'}
      position="sticky"
      top={`${HEADER_BAR_HEIGHT}px`}
      left={0}
    >
      <Center
        transition="50ms"
        style={{
          perspective: 2000,
        }}
        w="full"
        h="full"
        position="relative"
      >
        {children}
      </Center>
    </Box>
  </Box>
)

export const Envelope: React.FC<{
  progress?: number
  envelopeTransform?: string
  fullScreenHeight?: string
}> = ({ progress = 0, envelopeTransform, fullScreenHeight }) => {
  const { envelopeSealBackTransform, envelopeSealFrontTransform, isFlipped } =
    useMemo(() => {
      const frontDeg = 85
      const backDeg = 85
      const backProgress = Math.max((progress - 0.5) * 2, 0)
      const frontTransform = Math.min(progress * 2, 1) * frontDeg
      const backTransform = 0 - (backDeg - backProgress * backDeg)
      return {
        envelopeSealBackTransform: `rotateX(${backTransform}deg)`,
        envelopeSealFrontTransform: `rotateX(${frontTransform}deg)`,
        isFlipped: frontTransform >= frontDeg,
      }
    }, [progress])
  return (
    <>
      {/* 👇 LetterSealFront */}
      <EnvelopeContainer zIndex={4} fullScreenHeight={fullScreenHeight}>
        <Box
          position="relative"
          w="full"
          transition="50ms"
          style={{
            transform: envelopeTransform,
          }}
        >
          <Image src={EnvelopeBgPath.src} w="full" h="auto" />
          <Flex
            w="full"
            h="full"
            position="absolute"
            top="0"
            left="0"
            overflow="hidden"
            style={{
              opacity: isFlipped ? 0 : 1,
              perspective: 2000,
            }}
          >
            <Image
              src={EnvelopeCoverClosePath.src}
              w="full"
              h="auto"
              mb="auto"
              transformOrigin="top"
              transition="50ms"
              style={{
                transform: envelopeSealFrontTransform,
              }}
            />
          </Flex>
        </Box>
      </EnvelopeContainer>
      {/* 👇 LetterSealBack */}
      <EnvelopeContainer zIndex={1} fullScreenHeight={fullScreenHeight}>
        <Box
          position="relative"
          bg="#e7e7e7"
          shadow="0 0 20px rgba(0, 0, 0, 0.1)"
          borderBottomRadius="12px"
          w="full"
          transition="50ms"
          style={{
            transform: envelopeTransform,
          }}
        >
          <Image src={EnvelopeBgPath.src} w="full" h="auto" opacity={0} />
          <Flex
            w="full"
            h="full"
            position="absolute"
            left="0"
            bottom="calc(100% - 2px)"
            overflow="hidden"
            style={{
              opacity: isFlipped ? 1 : 0,
              perspective: 2000,
            }}
          >
            <Image
              src={EnvelopeCoverOpenPath.src}
              w="full"
              h="auto"
              mt="auto"
              transformOrigin="bottom"
              transition="50ms"
              style={{
                transform: envelopeSealBackTransform,
              }}
            />
          </Flex>
        </Box>
      </EnvelopeContainer>
    </>
  )
}
