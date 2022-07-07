import React from 'react'
import { Flex, Center, Text, Image as RowImage } from '@chakra-ui/react'
// @ts-ignore
import stampBg from 'assets/svg/stamp-bg.svg?url'
// @ts-ignore
import StampPng from 'assets/png/stamp.png'
import QrCode from 'qrcode.react'
import { MAIL_SERVER_URL } from 'app/constants'
import { Avatar } from '../Avatar'

export interface SignatureCardProps {
  account: string
}

function truncateMiddle(
  str = '',
  takeLength = 6,
  tailLength = takeLength,
  pad = '...'
): string {
  if (takeLength + tailLength >= str.length) return str
  return `${str.slice(0, takeLength)}${pad}${str.slice(-tailLength)}`
}

export const CardSignature = React.forwardRef<
  HTMLDivElement,
  SignatureCardProps
>(({ account, ...props }, ref) => (
  <Center
    position="relative"
    w="200px"
    h="188px"
    ref={ref}
    zIndex={0}
    {...props}
  >
    <Flex
      flexDirection="column"
      w="128px"
      h="168px"
      padding="10px"
      alignItems="center"
      position="relative"
    >
      <RowImage
        src={stampBg}
        position="absolute"
        w="inherit"
        h="inherit"
        top="0"
        left="0"
        zIndex={0}
      />
      <Flex position="relative" zIndex={1}>
        <Avatar isSquare w="100px" h="100px" address={account} />
      </Flex>
    </Flex>
    <Flex position="absolute" bottom="0" left="-10px" zIndex={2}>
      <RowImage src={StampPng.src} width="163px" height="144px" />
    </Flex>
    <Flex position="absolute" bottom="45px" right="45px" zIndex={2}>
      <Text
        fontSize="12px"
        w="95px"
        fontWeight={500}
        color="#4E52F5"
        lineHeight="10px"
      >
        {truncateMiddle(account, 6, 4)}
        <br />@{MAIL_SERVER_URL}
      </Text>
    </Flex>
    <Flex position="absolute" bottom="5px" zIndex={2}>
      <QrCode value={`https://mail3.me/${account}`} size={32} fgColor="blue" />
    </Flex>
  </Center>
))
