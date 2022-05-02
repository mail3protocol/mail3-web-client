import React from 'react'
import { Flex, Center } from '@chakra-ui/react'
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
      <Avatar w="100px" h="100px" address={account} />
    </Flex>
    <Flex position="absolute" bottom="0" left="-10px">
      <Image src={StampPng} width="163px" height="144px" />
    </Flex>
    <Flex position="absolute" bottom="10px">
      <QrCode value={`https://mail.me/${account}`} size={32} fgColor="blue" />
    </Flex>
  </Center>
)
