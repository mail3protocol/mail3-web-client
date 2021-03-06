import {
  AspectRatio,
  Box,
  BoxProps,
  Center,
  Flex,
  Image,
} from '@chakra-ui/react'
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
      h={fullScreenHeight ?? `calc(100vh - ${HEADER_BAR_HEIGHT}px)`}
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
  envelopeTransformEnded?: boolean
  fullScreenHeight?: string
  hiddenSide?: boolean
}> = ({
  progress = 0,
  hiddenSide,
  envelopeTransformEnded,
  envelopeTransform,
  fullScreenHeight,
}) => {
  const { envelopeSealBackTransform, envelopeSealFrontTransform, isFlipped } =
    useMemo(() => {
      const frontDeg = 85
      const backDeg = 85
      const backProgress = Math.max((progress - 0.5) * 2, 0)
      const frontTransform = Math.min(progress * 2, 1) * frontDeg
      const backTransform = 0 - (backDeg - backProgress * backDeg)
      return {
        envelopeSealBackTransform: `rotateX(${backTransform}deg)`,
        envelopeSealFrontTransform: `rotateX(${frontTransform}deg) translateZ(5px)`,
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
          transition="transform 50ms"
          borderBottomRadius="12px"
          style={{
            transformStyle: progress <= 0 ? 'preserve-3d' : undefined,
            transform: envelopeTransform,
            boxShadow: envelopeTransformEnded
              ? 'none'
              : '0 0 20px rgba(0, 0, 0, 0.1)',
            backfaceVisibility: 'hidden',
          }}
        >
          <Box
            position="absolute"
            bg="#eee"
            w="full"
            h="8px"
            top="-8px"
            left="0"
            transform="rotateX(-90deg) translateZ(4px)"
            rounded="100%"
            style={{
              opacity: hiddenSide ? 0 : 1,
            }}
          />
          <Image
            src={EnvelopeBgPath.src}
            w="full"
            h="auto"
            position="relative"
            borderBottomRadius="12px"
            zIndex={-1}
          />
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
            zIndex={1}
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
          borderBottomRadius="12px"
          w="full"
          shadow="0 0 20px rgba(0, 0, 0, 0.1)"
          style={{
            opacity: envelopeTransformEnded ? 1 : 0,
            transform: envelopeTransformEnded ? envelopeTransform : '',
          }}
        >
          <AspectRatio ratio={157 / 95} w="full" h="auto" opacity={0}>
            <div />
          </AspectRatio>
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
