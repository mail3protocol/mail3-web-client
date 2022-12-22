import { Box, Text } from '@chakra-ui/react'
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
  background-image: url(${PngBg});
  background-repeat: no-repeat;
  background-size: 100% auto;

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
        <Box
          w="100%"
          h="100px"
          position="absolute"
          top="0"
          left="0"
          bgImage={bannerUrl}
          bgRepeat="no-repeat"
          bgSize="auto 100%"
          bgPosition="center"
        />
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

        <Box fontWeight="600" fontSize="14px" lineHeight="20px" mt="16px">
          {desc}
        </Box>

        <Box className="qrCode">
          <QrCode value={qrUrl} size={66} />
        </Box>
      </Container>
    )
  }
)
