import { Box, Center, HStack, Image, Text } from '@chakra-ui/react'
import React, { forwardRef } from 'react'
import styled from '@emotion/styled'
import QrCode from 'qrcode.react'
import { Avatar, Button, Logo } from 'ui'
import classNames from 'classnames'

import _PngMail3MeButton from './assets/mail3-button.png'
import _PngBorder from './assets/border.png'
import _PngAddressBorder from './assets/address-border.png'
import _PngSeal from './assets/seal.png'
import { unifyImage } from '../utils'

const PngMail3MeButton = unifyImage(_PngMail3MeButton)
const PngBorder = unifyImage(_PngBorder)
const PngAddressBorder = unifyImage(_PngAddressBorder)
const PngSeal = unifyImage(_PngSeal)

interface ProfileCardProps {
  mailAddress: string
  isPic?: boolean
  homeUrl: string
  children?: React.ReactNode
  isDev?: boolean
}

const Container = styled(Box)`
  height: 566px;
  width: 375px;
  top: -9999px;
  left: -9999px;
  position: absolute;
  border-radius: 20px;
  background-image: url(${PngBorder});
  background-repeat: no-repeat;
  background-size: 100%;

  &.is-picture {
    top: 0;
    left: 0;
    position: relative;
    pointer-events: none;

    .border {
      filter: drop-shadow(0px 0px 8px rgba(0, 0, 0, 0.15));
    }

    .address .p {
      // fix html2canvas bug
      margin-top: 0;
      padding-bottom: 0;
    }
  }

  &.is-dev {
    top: 10px;
    left: auto;
    right: 10px;
    position: absolute;
  }

  .content {
    z-index: 2;
    height: 100%;
    position: relative;
  }

  .address {
    max-width: 310px;
    min-width: 280px;
    /* margin-top: 15px; */
    /* background: #f3f3f3; */
    /* border-radius: 16px; */
    padding: 13px;
    text-align: center;
    position: relative;

    .p {
      font-style: normal;
      font-weight: 600;
      font-size: 19px;
      line-height: 1;
      z-index: 2;
      position: relative;
      // fix html2canvas bug
      margin-top: -10px;
      padding-bottom: 10px;
      span {
        margin-left: -5px;
      }
    }

    .address-border {
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      z-index: 1;
      position: absolute;
    }
  }

  .qrCode {
    left: 50%;
    bottom: 90px;
    transform: translateX(-50%);
    position: absolute;
  }

  .button {
    width: 250px;
    bottom: 32px;
    left: 50%;
    margin-left: -125px;
    position: absolute;
    text-align: center;
    padding: 2% 0;
  }

  .avatar-wrap {
    position: relative;
    padding-bottom: 15px;
    .seal {
      top: 0;
      left: 0;
      width: 268px;
      max-width: none;
      z-index: 0;
      position: absolute;
      transform: translate(-57px, -60px);
    }
  }

  .border {
    width: 100%;
    height: 100%;
    z-index: 1;
    top: 0;
    left: 0;
    position: absolute;
  }
`

export const ProfileCardHome = forwardRef<HTMLDivElement, ProfileCardProps>(
  ({ mailAddress, isPic, isDev, children, homeUrl }, ref) => {
    const address = mailAddress.substring(0, mailAddress.indexOf('@'))
    const mailSuffix = mailAddress.substring(mailAddress.indexOf('@'))

    return (
      <Container
        ref={ref}
        className={classNames({
          'is-picture': isPic,
          'is-dev': isDev,
        })}
      >
        <Image src={PngBorder} className="border" alt="" />
        <Box className="content">
          <Center flexDirection="column">
            <Box pt="35px">
              <Logo
                w="100px"
                iconProps={{ w: '26px', h: '26px' }}
                textProps={{ w: '67px', h: '20px', ml: '0' }}
                justify="space-between"
              />
            </Box>
            <Box mt="20px" className="avatar-wrap">
              <Box position="relative" zIndex={2}>
                <Avatar address={address} w="72px" h="72px" isSquare />
              </Box>
              <Image src={PngSeal} className="seal" />
            </Box>
            <Box className="address">
              <Text className="p">
                {address}
                <span>{` ${mailSuffix}`}</span>
              </Text>
              <Box className="address-border">
                <Image w="100%" h="100%" src={PngAddressBorder} alt="" />
              </Box>
            </Box>
            <HStack spacing="24px" mt="16px">
              {children}
            </HStack>

            <Box className="qrCode">
              <QrCode
                value={`${homeUrl}/${address}?utm_medium=qrcode`}
                size={130}
              />
            </Box>

            <Button className="button">
              <Image
                src={PngMail3MeButton}
                alt=""
                w="auto"
                h="full"
                objectFit="cover"
              />
            </Button>
          </Center>
        </Box>
      </Container>
    )
  }
)
