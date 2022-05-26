import React from 'react'
import { Box, HStack, Wrap, WrapItem } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import SVGInbox from '../../../assets/inbox.svg'
import SVGSub from '../../../assets/subscrption.svg'
import { RoutePath } from '../../../route/path'

export enum InboxNavType {
  Inbox = 'Inbox',
  Subscription = 'Subscription',
}

interface NavItem {
  icon: any
  title: string
}

const navMap: Record<InboxNavType, NavItem> = {
  [InboxNavType.Inbox]: {
    icon: <SVGInbox />,
    title: 'Inbox',
  },
  [InboxNavType.Subscription]: {
    icon: <SVGSub />,
    title: 'Subscrption',
  },
}

export const InboxNav: React.FC<{ currentType: InboxNavType }> = ({
  currentType,
}) => {
  const router = useRouter()
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
    <HStack spacing={{ md: '80px', base: '40px' }}>
      {Object.keys(navMap).map((type) => {
        const { icon, title } = navMap[type as keyof typeof InboxNavType]

        return (
          <Wrap
            key={title}
            {...(type === currentType ? curStyleItem : initStyles)}
            onClick={() => {
              if (type === InboxNavType.Subscription) {
                router.push(RoutePath.Subscription)
              } else {
                router.push(RoutePath.Home)
              }
            }}
          >
            <WrapItem>{icon}</WrapItem>
            <WrapItem>
              <Box {...(type === currentType ? curStyleWord : {})}>{title}</Box>
            </WrapItem>
          </Wrap>
        )
      })}
    </HStack>
  )
}
