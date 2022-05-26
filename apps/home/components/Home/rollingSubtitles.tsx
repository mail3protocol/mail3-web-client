import styled from '@emotion/styled'
import { Box, Flex, Stack } from '@chakra-ui/react'
import React, { useEffect, useRef } from 'react'
import { fromEvent } from 'rxjs'

export const RollingSubtitlesWithAnimation = styled(Box)`
  animation: ${(props: { reverse?: boolean }) =>
      props?.reverse ? 'rollingSubtitleRunReverse' : 'rollingSubtitleRun'}
    60s infinite linear;
  position: absolute;
  display: flex;
  width: auto;
  height: 100%;
  white-space: nowrap;

  @keyframes rollingSubtitleRun {
    0% {
      transform: translateX(0);
    }

    100% {
      transform: translateX(-50%);
    }
  }

  @keyframes rollingSubtitleRunReverse {
    0% {
      transform: translateX(-50%);
    }
    100% {
      transform: translateX(0);
    }
  }
`

export const RollingBackgroundCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const renderTextContent = new Array(5)
      .fill('   Web3      Mail3   ')
      .join('')
    const canvasEl = canvasRef.current as HTMLCanvasElement
    const ctx = canvasEl.getContext('2d')!
    function setCanvasSizeByWindow() {
      canvasEl.width = window.innerWidth
      canvasEl.height = window.innerHeight
    }
    function setCtxFontInfo() {
      ctx.font = "bold 120px 'Poppins'"
      ctx.fillStyle = '#E1E1E1'
    }
    setCanvasSizeByWindow()
    const resizeEventSubscriber = fromEvent(window, 'resize').subscribe(
      setCanvasSizeByWindow
    )
    let renderTextContentWidth = ctx.measureText(renderTextContent).width
    let offsetX = 0
    let animationFrame: number
    function renderText() {
      setCtxFontInfo()
      ctx.clearRect(0, 0, canvasEl.width, canvasEl.height)
      renderTextContentWidth = ctx.measureText(renderTextContent).width
      for (let i = 0; i < 4; i++) {
        const y = 300 * i
        if (i % 2 === 0) {
          ctx.fillText(renderTextContent, offsetX - renderTextContentWidth, y)
          ctx.fillText(renderTextContent, offsetX, y)
        } else {
          ctx.fillText(renderTextContent, -offsetX, y)
          ctx.fillText(renderTextContent, renderTextContentWidth - offsetX, y)
        }
      }
      offsetX =
        offsetX >= renderTextContentWidth
          ? 0
          : Math.min(offsetX + 1, renderTextContentWidth)
      animationFrame = requestAnimationFrame(renderText)
    }
    setCtxFontInfo()
    animationFrame = requestAnimationFrame(renderText)
    return () => {
      resizeEventSubscriber.unsubscribe()
      cancelAnimationFrame(animationFrame)
    }
  }, [])

  return <canvas ref={canvasRef} style={{ width: '100%' }} />
}

export const RollingBackground = () => (
  <Box
    w="full"
    h="100vh"
    overflow="hidden"
    position="relative"
    fontWeight="bold"
    fontSize="120px"
    color="#E1E1E1"
  >
    {[false, true].map((isReverse) => (
      <RollingSubtitlesWithAnimation
        reverse={isReverse}
        key={isReverse.toString()}
      >
        <Stack
          spacing="300px"
          direction="column"
          transform={isReverse ? 'translateY(300px)' : ''}
        >
          {new Array(5)
            .fill(0)
            .map((_, i) => i)
            .map((stackItemIndex) => (
              <Flex
                w="auto"
                key={stackItemIndex}
                h="300px"
                minH="300px"
                lineHeight="300px"
              >
                {new Array(2)
                  .fill(0)
                  .map((_, i) => i)
                  .map((k) => (
                    <Box
                      minW="100vh"
                      key={k}
                      h="300px"
                      lineHeight="300px"
                      whiteSpace="pre"
                    >
                      {new Array(5).fill('   Web3      Mail3   ').join('')}
                    </Box>
                  ))}
              </Flex>
            ))}
        </Stack>
      </RollingSubtitlesWithAnimation>
    ))}
  </Box>
)

export const RollingSubtitles = () => (
  <Box
    bg="#000"
    h="44px"
    overflow="hidden"
    position="relative"
    color="#fff"
    fontSize="16px"
  >
    <RollingSubtitlesWithAnimation lineHeight="44px" fontWeight="bold">
      {new Array(2)
        .fill(0)
        .map((_, i) => i)
        .map((k) => (
          <Box minW="100vh" key={k} whiteSpace="pre">
            {new Array(10).fill('Web3.0      Mail3      ').join('')}
          </Box>
        ))}
    </RollingSubtitlesWithAnimation>
  </Box>
)
