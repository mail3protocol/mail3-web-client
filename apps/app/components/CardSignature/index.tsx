import React, { useMemo } from 'react'
import { Flex, Center, Text, Image as RowImage } from '@chakra-ui/react'
import StampBg from 'assets/svg/stamp-bg.svg'
import StampPng from 'assets/png/stamp.png'
import QrCode from 'qrcode.react'
import { Avatar } from 'ui'
import { isPrimitiveEthAddress, truncateMiddle } from 'shared'
import { MAIL_SERVER_URL } from '../../constants'

const stampBg = StampBg as any

export interface SignatureCardProps {
  account: string
  isUseSvgAvatar?: boolean
}

export const CardSignature = React.forwardRef<
  HTMLDivElement,
  SignatureCardProps
>(({ account, isUseSvgAvatar, ...props }, ref) => {
  const addr = useMemo(() => {
    const MAX_STRING_LENGTH = 13
    if (isPrimitiveEthAddress(account)) return truncateMiddle(account, 6, 4)
    if (account.length > MAX_STRING_LENGTH) return truncateMiddle(account, 6, 3)
    return account
  }, [account])

  return (
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
          <Avatar
            isSquare
            w="100px"
            h="100px"
            address={account}
            isUseSvg={isUseSvgAvatar}
          />
        </Flex>
      </Flex>
      <Flex position="absolute" bottom="0" left="-10px" zIndex={2}>
        <RowImage src={StampPng} width="163px" height="144px" />
      </Flex>
      <Flex
        position="absolute"
        bottom="47px"
        right="50px"
        w="95px"
        h="20px"
        zIndex={2}
      >
        <Text
          fontSize="12px"
          w="95px"
          fontWeight={500}
          color="#4E52F5"
          lineHeight="10px"
        >
          {addr}
          <br />@{MAIL_SERVER_URL}
        </Text>
      </Flex>
      <Flex position="absolute" bottom="5px" zIndex={2}>
        <QrCode
          value={`https://mail3.me/${account}`}
          size={32}
          fgColor="blue"
        />
      </Flex>
    </Center>
  )
})
