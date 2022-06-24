import { Box, Center, HStack, Image, Text } from '@chakra-ui/react'
import React, { forwardRef } from 'react'
import styled from '@emotion/styled'
import QrCode from 'qrcode.react'
import { Avatar, Button } from 'ui'
// @ts-ignore
import LogoSvg from 'assets/svg/logo-pure.svg'
// @ts-ignore
import PngBorder from 'assets/profile/border.png'
import PngMailMeButton from 'assets/profile/mail-me-button.png'

interface ProfileCardProps {
  mailAddress: string
  isPic?: boolean
  homeUrl: string
  children?: React.ReactNode
}

const Container = styled(Box)`
  background: #fff;
  height: 566px;
  width: 375px;
  top: -9999px;
  left: -9999px;
  /* top: 10px; */
  /* left: 10px; */
  position: absolute;
  border-radius: 20px;

  &.is-picture {
    top: 0;
    left: 0;
    position: relative;
    pointer-events: none;
    box-shadow: 1px 1px 10px #ccc;

    .border {
      display: none;
    }
  }

  .address {
    max-width: 90%;
    margin-top: 15px;
    background: #f3f3f3;
    border-radius: 16px;
    padding: 13px;
    text-align: center;

    .p {
      font-style: normal;
      font-weight: 600;
      font-size: 19px;
      line-height: 1;
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

  .border {
    width: 100%;
    height: 100%;
    z-index: 0;
    top: 0;
    left: 0;
    position: absolute;
  }
`

export const ProfileCard = forwardRef<HTMLDivElement, ProfileCardProps>(
  ({ mailAddress, isPic, children, homeUrl }, ref) => {
    const address = mailAddress.substring(0, mailAddress.indexOf('@'))

    return (
      <Container ref={ref} className={isPic ? 'is-picture' : ''}>
        <Image src={PngBorder.src} className="border" alt="" />
        <Center flexDirection="column">
          <Box pt="20px">
            <LogoSvg />
          </Box>
          <Box mt="35px">
            <Avatar address={address} w="72px" h="72px" />
          </Box>
          <Box className="address">
            <Text className="p">{mailAddress}</Text>
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
      </Container>
    )
  }
)
