import React from 'react'
import { Box, HStack, Wrap, WrapItem } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import styled from '@emotion/styled'
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

const HStackContainer = styled(HStack)`
  .wrap {
    font-weight: 700;
    font-size: 24px;
    line-height: 30px;
    color: #6f6f6f;
    align-items: center;
    cursor: pointer;
  }

  .wrap.cur {
    color: #000;
  }

  .box-cur {
    position: relative;
  }

  .box-cur::before {
    content: '';
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    position: absolute;
    height: 3px;
    width: 50px;
    background-color: #000;
  }
`

export const InboxNav: React.FC<{ currentType: InboxNavType }> = ({
  currentType,
}) => {
  const router = useRouter()

  return (
    <HStackContainer spacing={{ md: '80px', base: '40px' }}>
      {Object.keys(navMap).map((type) => {
        const { icon, title } = navMap[type as keyof typeof InboxNavType]
        const isCur = type === currentType
        return (
          <Wrap
            className={isCur ? 'wrap cur' : 'wrap'}
            key={title}
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
              <Box className={isCur ? 'box-cur' : ''}>{title}</Box>
            </WrapItem>
          </Wrap>
        )
      })}
    </HStackContainer>
  )
}
