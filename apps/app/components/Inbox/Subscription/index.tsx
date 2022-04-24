import React from 'react'
import { Avatar, Box, Center, Text, Wrap, WrapItem } from '@chakra-ui/react'
import { Button } from 'ui'
import { useDidMount } from '../../../hooks/useDidMount'
import AvatarTemp from '../../../assets/sub-avatar-temp.png'
import SVGVector from '../../../assets/sub-icon-vector.svg'
import SVGBell from '../../../assets/sub-icon-bell.svg'
import SVGBellCur from '../../../assets/sub-icon-bell-cur.svg'

let data = [
  {
    avatarSrc: AvatarTemp,
    name: 'name',
    desc: 'Hi，I am your best ne spiderman.Hi，I am your best neighbor spiderman.',
    isSub: false,
    isNew: true,
  },
  {
    avatarSrc: AvatarTemp,
    name: 'name',
    desc: 'Hi，I am your best neighbor spiderman',
    isSub: true,
    isNew: false,
  },
  {
    avatarSrc: AvatarTemp,
    name: 'name',
    desc: 'Hi，I am your best neighbor spiderman.Hi，I am your best neighbor spiderman.Hi，I am your best neighbor spiderman. neighbor spiderman.Hi，I am your best neighbor spiderman.Hi，I am your best neighbor spiderman.',
    isSub: false,
    isNew: false,
  },
  {
    avatarSrc: AvatarTemp,
    name: 'name',
    desc: 'Hi，I am your best neighbor spiderman.Hi，I am your best or spiderman.Hi，I am your best neighbor spiderman.Hi，I  spiderman.Hi，I am your best neighbor spiderman.',
    isSub: false,
    isNew: false,
  },
]
data = [...data, ...data]
data = [...data, ...data]
data = [...data, ...data]

const Item = (props: {
  name: any
  avatarSrc: any
  desc: any
  isSub: boolean
}) => {
  const { name, avatarSrc, desc, isSub } = props

  let _button = (
    <Button w="100px">
      <SVGBell />
    </Button>
  )

  if (isSub) {
    _button = (
      <Button
        w="100px"
        bg="transparent"
        border="1px solid #6F6F6F"
        boxShadow="none"
        color="#6F6F6F"
        _hover={{
          bg: '#f2f2f2',
        }}
        leftIcon={<SVGBellCur />}
      >
        Cancel
      </Button>
    )
  }

  return (
    <>
      <Avatar src={avatarSrc.src} />
      <Box>
        <Center>
          <SVGVector />{' '}
          <Box marginLeft="5px" fontWeight="700" fontSize="18px">
            {name}
          </Box>
        </Center>
      </Box>

      <Text
        noOfLines={4}
        maxWidth="220px"
        fontWeight="400"
        fontSize="12px"
        lineHeight="16px"
        height="64px"
        align="center"
      >
        {desc}
      </Text>

      {_button}
    </>
  )
}

export const Subscription: React.FC = () => {
  useDidMount(() => {
    console.log('subscription')
  })

  return (
    <Box color="#000">
      <Box lineHeight="30px" textAlign="center">
        <Box fontWeight="700" fontSize="28px">
          Coming soon：
        </Box>
        <Box fontWeight="300" fontSize="20px">
          subscribe to your favorite authors and you&apos;ll receive a curated
          email when they update their content
        </Box>
      </Box>

      <Box marginTop="20px">
        <Wrap spacing="20px" justify="center">
          {data.map((item) => (
            <WrapItem
              key={item.name}
              w="259px"
              h="266px"
              bg="#FFFFFF"
              boxShadow="0px 0px 6px 2px rgba(198, 198, 198, 0.2)"
              borderRadius="12px"
              flexDirection="column"
              alignItems="center"
              justifyContent="space-evenly"
            >
              <Item {...item} />
            </WrapItem>
          ))}
        </Wrap>
      </Box>
    </Box>
  )
}
