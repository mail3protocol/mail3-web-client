import { Box, Center, HStack, Image, Text } from '@chakra-ui/react'
import React, { forwardRef } from 'react'
import styled from '@emotion/styled'
import QrCode from 'qrcode.react'
import { Avatar, Button } from 'ui'
import classNames from 'classnames'

import LogoSvg from 'assets/svg/logo-pure.svg'
import PngMailMeButton from 'assets/profile/mail-me-button.png'
import PngBorder from './assets/border.png'
import PngAddressBorder from './assets/address-border.png'
import PngSeal from './assets/seal.png'

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
  background-image: url(${PngBorder.src});
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
    left: 10px;
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
    bottom: 116px;
    transform: translateX(-50%);
    position: absolute;
  }

  .button {
    width: 250px;
    bottom: 32px;
    left: 50%;
    margin-left: -125px;
    position: absolute;
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

export const ProfileCard = forwardRef<HTMLDivElement, ProfileCardProps>(
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
        <Image src={PngBorder.src} className="border" alt="" />
        <Box className="content">
          <Center flexDirection="column">
            <Box pt="35px">
              <LogoSvg />
            </Box>
            <Box mt="20px" className="avatar-wrap">
              <Box position="relative" zIndex={2}>
                <Avatar address={address} w="72px" h="72px" />
              </Box>
              <Image src={PngSeal.src} className="seal" />
            </Box>
            <Box className="address">
              <Text className="p">
                {address}
                <span>{` ${mailSuffix}`}</span>
              </Text>
              <Box className="address-border">
                <Image w="100%" h="100%" src={PngAddressBorder.src} alt="" />
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
              <Image src={PngMailMeButton.src} w="100%" height="100%" />
            </Button>
          </Center>
        </Box>
      </Container>
    )
  }
)
