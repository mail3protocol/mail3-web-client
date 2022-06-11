import React from 'react'
import { Box, HStack, Wrap, WrapItem } from '@chakra-ui/react'
import styled from '@emotion/styled'
import Link from 'next/link'
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
    title: 'Subscription',
  },
}

const HStackContainer = styled(HStack)`
  .wrap {
    font-weight: 700;
    font-size: 24px;
    line-height: 30px;
    color: #6f6f6f;
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
    bottom: -5px;
    left: 50%;
    transform: translateX(-50%);
    position: absolute;
    height: 4px;
    width: 100%;
    border-radius: 10px;
    background-color: #000;
  }
`

export const InboxNav: React.FC<{ currentType: InboxNavType }> = ({
  currentType,
}) => (
  <HStackContainer spacing={{ md: '80px', base: '40px' }}>
    {Object.keys(navMap).map((type, index) => {
      const { icon, title } = navMap[type as keyof typeof InboxNavType]
      const isCur = type === currentType

      return (
        <Link
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          href={
            type === InboxNavType.Subscription
              ? RoutePath.Subscription
              : RoutePath.Home
          }
        >
          <a
            onClick={() => {
              // report point
            }}
          >
            <Wrap className={isCur ? 'wrap cur' : 'wrap'} align="center">
              <WrapItem>{icon}</WrapItem>
              <WrapItem>
                <Box className={isCur ? 'box-cur' : ''}>{title}</Box>
              </WrapItem>
            </Wrap>
          </a>
        </Link>
      )
    })}
  </HStackContainer>
)
