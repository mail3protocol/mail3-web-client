import React, { useState } from 'react'
import { Avatar, Box, Center, Text, Wrap, WrapItem } from '@chakra-ui/react'
import { Button } from 'ui'
import { useDidMount } from 'hooks'
import update from 'immutability-helper'
import AvatarTemp from '../../../assets/sub-avatar-temp.png'
import SubTop from '../../../assets/subscrption-top.png'
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
// data = [...data, ...data]
// data = [...data, ...data]

interface ListItem {
  isNew: boolean
  name: any
  avatarSrc: any
  desc: any
  isSub: boolean
}

type HandleClick = (index: number, type: string) => void

interface ItemProps extends ListItem {
  index: number
  handleClick: HandleClick
}

const Item = (props: ItemProps) => {
  const { name, avatarSrc, desc, isSub, isNew, index, handleClick } = props

  let _button = (
    <Button
      w="100px"
      onClick={() => {
        handleClick(index, 'follow')
      }}
    >
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
        onClick={() => {
          handleClick(index, 'unfollow')
        }}
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
      {isNew && (
        <Box position="absolute" top="-2px" left="-7px">
          <Center w="75px" h="29px" bg={`url(${SubTop.src})`}>
            News
          </Center>
        </Box>
      )}
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
  const [list, setList] = useState<Array<ListItem>>([])

  useDidMount(() => {
    console.log('subscription')
    setList(data)
  })

  const handleClick: HandleClick = (index, type) => {
    let newList: Array<ListItem> = []

    if (type === 'follow') {
      // doing follow
      newList = update(list, {
        [index]: {
          isSub: {
            $set: true,
          },
        },
      })
    } else {
      // doing unfollow
      newList = update(list, {
        [index]: {
          isSub: {
            $set: false,
          },
        },
      })
    }
    setList(newList)
  }

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
          {list.map((item, index) => (
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
              position="relative"
            >
              <Item {...item} index={index} handleClick={handleClick} />
            </WrapItem>
          ))}
        </Wrap>
      </Box>
    </Box>
  )
}
