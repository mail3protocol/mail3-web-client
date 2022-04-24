import React, { useState } from 'react'
import { Box, HStack, Wrap, WrapItem } from '@chakra-ui/react'
import SVGInbox from '../../../assets/inbox.svg'
import SVGSub from '../../../assets/subscrption.svg'

export const InboxNav: React.FC = () => {
  const [index, setIndex] = useState(0)

  const initStyles = {
    fontWeight: 700,
    fontSize: '24px',
    lineHeight: '30px',
    color: '#6F6F6F',
    align: 'center',
    cursor: 'pointer',
  }

  const curStyleItem = {
    ...initStyles,
    color: '#000',
  }

  const curStyleWord: any = {
    position: 'relative',
    _before: {
      content: '""',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      position: 'absolute',
      h: '3px',
      w: '50px',
      bg: '#000',
    },
  }

  const list = [
    {
      icon: <SVGInbox />,
      title: 'Inbox',
    },
    {
      icon: <SVGSub />,
      title: 'Subscrption',
    },
  ]

  return (
    <HStack spacing="80px">
      {list.map((item, i) => {
        const { icon, title } = item
        return (
          <Wrap
            key={title}
            {...(i === index ? curStyleItem : initStyles)}
            onClick={() => {
              setIndex(i)
              console.log('title', title)
            }}
          >
            <WrapItem>{icon}</WrapItem>
            <WrapItem>
              <Box {...(i === index ? curStyleWord : {})}>{title}</Box>
            </WrapItem>
          </Wrap>
        )
      })}
    </HStack>
  )
}
