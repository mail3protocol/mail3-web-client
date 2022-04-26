import React from 'react'
import { Box, HStack, Wrap, WrapItem } from '@chakra-ui/react'
import { useAtom } from 'jotai'
import SVGInbox from '../../../assets/inbox.svg'
import SVGSub from '../../../assets/subscrption.svg'
import { pageTypeAtom } from '..'

const navList = [
  {
    icon: <SVGInbox />,
    title: 'Inbox',
  },
  {
    icon: <SVGSub />,
    title: 'Subscrption',
  },
]

export const InboxNav: React.FC = () => {
  const [pageType, setPageType] = useAtom(pageTypeAtom)

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

  return (
    <HStack spacing="80px">
      {navList.map((item, i) => {
        const { icon, title } = item
        return (
          <Wrap
            key={title}
            {...(i === pageType ? curStyleItem : initStyles)}
            onClick={() => {
              setPageType(i)
            }}
          >
            <WrapItem>{icon}</WrapItem>
            <WrapItem>
              <Box {...(i === pageType ? curStyleWord : {})}>{title}</Box>
            </WrapItem>
          </Wrap>
        )
      })}
    </HStack>
  )
}
