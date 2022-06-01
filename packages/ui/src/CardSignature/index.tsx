import React from 'react'
import { Flex, Center, Text } from '@chakra-ui/react'
import Image from 'next/image'
// @ts-ignore
import stampBg from 'assets/svg/stamp-bg.svg?url'
// @ts-ignore
import StampPng from 'assets/png/stamp.png'
import QrCode from 'qrcode.react'
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

export const CardSignature: React.FC<SignatureCardProps> = ({ account }) => (
  <Center position="relative" w="200px" h="188px">
    <Flex
      flexDirection="column"
      bg={`url(${stampBg})`}
      w="128px"
      h="168px"
      padding="10px"
      alignItems="center"
    >
      <Avatar isSquare w="100px" h="100px" address={account} />
    </Flex>
    <Flex position="absolute" bottom="0" left="-10px">
      <Image src={StampPng} width="163px" height="144px" />
    </Flex>
    <Flex position="absolute" bottom="42px" right="45px">
      <Text
        fontSize="12px"
        w="95px"
        fontWeight={700}
        color="#4E52F5"
        lineHeight="10px"
      >{`${truncateMiddle(account, 6, 4)}@mail3.me`}</Text>
    </Flex>
    <Flex position="absolute" bottom="5px">
      <QrCode value={`https://mail3.me/${account}`} size={32} fgColor="blue" />
    </Flex>
  </Center>
)
