import { Box, Center, Image, Text } from '@chakra-ui/react'
import React, { forwardRef } from 'react'
import styled from '@emotion/styled'
import QrCode from 'qrcode.react'
import { Avatar } from 'ui'
import classNames from 'classnames'

import _PngLogo from './assets/logo.png'
import { unifyImage } from '../utils'

const PngLogo = unifyImage(_PngLogo)

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
  height: auto;
  width: 1005px;
  top: -9999px;
  left: -9999px;
  position: absolute;
  padding: 171px 80px 80px;
  background-color: #fff;
  color: #000;
  overflow: hidden;

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
      >
        <Center w="100%" h="360px" position="absolute" top="0" left="0">
          <Image
            src={bannerUrl}
            w="auto"
            h="360px"
            crossOrigin="anonymous"
            maxW="none"
          />
        </Center>
        <Avatar
          address={address}
          w="272px"
          h="272px"
          borderRadius="50%"
          onChangeAvatarCallback={onChangeAvatarCallback}
          position="relative"
          zIndex="2"
        />
        <Text fontWeight="700" fontSize="100px" lineHeight="120px" mt="16px">
          {nickname}
        </Text>

        <Text
          fontWeight="400"
          fontSize="40px"
          lineHeight="60px"
          color="#999"
          mt="16px"
        >
          {mailAddress}
        </Text>

        {desc ? (
          <Text
            className="shifted-text"
            minH="350px"
            mt="40px"
            fontWeight="400"
            fontSize="40px"
            lineHeight="56px"
            whiteSpace="pre-line"
            letterSpacing="0.3px"
            h={isPic ? '350px' : 'auto'}
            overflow="hidden"
          >
            {desc}
          </Text>
        ) : null}

        <Center justifyContent="space-between" mt="40px">
          <Image src={PngLogo} w="406px" h="210px" />
          <Box w="210px" h="210px">
            <QrCode value={qrUrl} size={210} />
          </Box>
        </Center>
      </Container>
    )
  }
)
