import { Box, Flex, Icon } from '@chakra-ui/react'
import { CONTAINER_MAX_WIDTH } from 'ui'
import React from 'react'
import { useInnerSize } from 'hooks/src/useInnerSize'
import EnvelopeBgSvg from '../../assets/svg/envelope-bg.svg'
import EnvelopeBottomCoverSvg from '../../assets/svg/envelope-bottom-cover.svg'

export const Letter: React.FC = () => {
  const envelopePaddingX = 60
  const { width } = useInnerSize()
  return (
    <Flex
      w="full"
      h="auto"
      position="relative"
      maxW={`${CONTAINER_MAX_WIDTH}px`}
      mx="auto"
      direction="column"
      align="center"
      pt={{
        base: '48px',
        md: '64px',
      }}
      pb={{
        base: '0',
        md: '64px',
      }}
      minH="calc(100vh - 44px - 60px)"
    >
      <Flex
        direction="column"
        position="absolute"
        top="16px"
        left={{
          base: 0,
          md: `${envelopePaddingX}px`,
        }}
        w={{
          base: 'full',
          md: `calc(100% - ${envelopePaddingX * 2}px)`,
        }}
        h="calc(100% - 64px - 64px)"
        pb="2%"
      >
        <Icon
          as={EnvelopeBgSvg}
          w="full"
          h="auto"
          overflow="hidden"
          position="relative"
        />
        <Box
          w="full"
          h="full"
          mt="-10px"
          mx="auto"
          position="relative"
          bg="#e7e7e7"
          rounded="6px"
        />
      </Flex>
      <Box
        bg="#fff"
        w={{
          base: 'calc(100% - 40px)',
          md: `calc(100% - 90px - ${envelopePaddingX * 2}px)`,
        }}
        h="auto"
        shadow="0 0 20px rgba(0, 0, 0, 0.15)"
        rounded="24px"
        position="relative"
        mx="auto"
        flex={1}
        minH={`${Math.min(width, CONTAINER_MAX_WIDTH)}px`}
      />
      <Flex
        overflow="hidden"
        bottom={{ base: 0, md: '32px' }}
        left={{
          base: 0,
          md: `${envelopePaddingX}px`,
        }}
        position="absolute"
        w={{
          base: 'full',
          md: `calc(100% - ${envelopePaddingX * 2}px)`,
        }}
        h="auto"
      >
        <Icon
          as={EnvelopeBottomCoverSvg}
          w="full"
          h="auto"
          mt="auto"
          transform="scale(1.035)"
        />
      </Flex>
    </Flex>
  )
}
