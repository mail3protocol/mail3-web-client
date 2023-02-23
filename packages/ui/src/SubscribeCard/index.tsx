import { Box, Center, Image, Text } from '@chakra-ui/react'
import React, { forwardRef } from 'react'
import styled from '@emotion/styled'
import QrCode from 'qrcode.react'
import { Avatar } from 'ui'
import classNames from 'classnames'

import _PngBg from './assets/bg.png'
import { unifyImage } from '../utils'

const PngBg = unifyImage(_PngBg)

interface SubscribeProps {
  mailAddress: string
  isPic?: boolean
  nickname?: string
  isDev?: boolean
  desc?: string
  bannerUrl?: string
  qrUrl: string
  onChangeAvatarCallback?: (currentAvatar?: string) => void
}

const Container = styled(Box)`
  height: 535px;
  width: 335px;
  top: -9999px;
  left: -9999px;
  position: absolute;

  &.is-picture {
    top: 0;
    left: 0;
    position: relative;
    pointer-events: none;
  }

  &.is-dev {
    top: 100px;
    left: auto;
    right: 100px;
    z-index: 9999;
    position: fixed;
  }

  .qrCode {
    right: 25px;
    bottom: 17px;
    position: absolute;
  }
`

export const SubscribeCard = forwardRef<HTMLDivElement, SubscribeProps>(
  (
    {
      mailAddress,
      isPic,
      isDev,
      nickname,
      desc,
      onChangeAvatarCallback,
      bannerUrl,
      qrUrl,
    },
    ref
  ) => {
    const address = mailAddress.substring(0, mailAddress.indexOf('@'))

    return (
      <Container
        ref={ref}
        className={classNames({
          'is-picture': isPic,
          'is-dev': isDev,
        })}
        color="#fff"
        p="74px 24px"
        overflow="hidden"
        rounded="24px"
      >
        <Image
          w="100%"
          h="100%"
          src={PngBg}
          position="absolute"
          zIndex="-1"
          top="0"
          left="0"
        />
        <Center w="100%" h="100px" position="absolute" top="0" left="0">
          <Image
            src={bannerUrl}
            w="auto"
            h="100px"
            crossOrigin="anonymous"
            maxW="none"
          />
        </Center>
        <Avatar
          address={address}
          w="60px"
          h="60px"
          borderRadius="50%"
          onChangeAvatarCallback={onChangeAvatarCallback}
          position="relative"
          zIndex="2"
        />
        <Text fontWeight="700" fontSize="20px" lineHeight="28px" mb="4px">
          {nickname}
        </Text>

        <Text fontWeight="300" fontSize="12px" lineHeight="20px">
          {mailAddress}
        </Text>

        <Text
          fontWeight="600"
          fontSize="14px"
          lineHeight="20px"
          mt="16px"
          whiteSpace="pre-line"
          noOfLines={5}
        >
          {desc}
        </Text>

        <Box className="qrCode">
          <QrCode
            value={qrUrl}
            size={66}
            bgColor="transparent"
            fgColor="#ffffff"
          />
        </Box>
      </Container>
    )
  }
)
