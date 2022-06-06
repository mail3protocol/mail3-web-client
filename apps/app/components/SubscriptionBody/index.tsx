import React, { useState } from 'react'
import { Avatar, Box, Center, Text, Wrap, WrapItem } from '@chakra-ui/react'
import { Button } from 'ui'
import { TrackEvent, TrackKey, useDidMount, useTrackClick } from 'hooks'
import AvatarTemp from '../../assets/subscription/avatar-temp.png'
import SubTop from '../../assets/subscription/top.png'
import SVGVector from '../../assets/subscription/vector.svg'
import SVGBell from '../../assets/subscription/bell.svg'
import SVGBellCur from '../../assets/subscription/bell-cur.svg'

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
    name: 'name1',
    desc: 'Hi，I am your best neighbor spiderman',
    isSub: true,
    isNew: false,
  },
  {
    avatarSrc: AvatarTemp,
    name: 'name2',
    desc: 'Hi，I am your best neighbor spiderman.Hi，I am your best neighbor spiderman.Hi，I am your best neighbor spiderman. neighbor spiderman.Hi，I am your best neighbor spiderman.Hi，I am your best neighbor spiderman.',
    isSub: false,
    isNew: false,
  },
  {
    avatarSrc: AvatarTemp,
    name: 'name3',
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
  name: string
  avatarSrc: any
  desc: string
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
      <Box
        maxWidth="220px"
        fontWeight="400"
        fontSize="12px"
        lineHeight="16px"
        height="64px"
        textAlign="center"
      >
        <Text noOfLines={4}>{desc}</Text>
      </Box>
      {_button}
    </>
  )
}

export const SubscriptionBody: React.FC = () => {
  const trackBell = useTrackClick(TrackEvent.ClickSubscriptionBell)
  const [list, setList] = useState<Array<ListItem>>([])

  useDidMount(() => {
    setList(data)
  })

  const handleClick: HandleClick = (index, type) => {
    const newList = [...list]
    trackBell({
      [TrackKey.SubscriptionBell]: newList[index].name,
    })
    if (type === 'follow') {
      // doing follow
      newList[index].isSub = true
    } else {
      // doing unfollow
      newList[index].isSub = false
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
