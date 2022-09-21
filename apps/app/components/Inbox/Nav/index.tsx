import React, { ReactNode, useRef } from 'react'
import { Box, Flex, HStack } from '@chakra-ui/react'
import styled from '@emotion/styled'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useDidMount } from 'hooks'
import { ReactComponent as SVGInbox } from '../../../assets/inbox.svg'
import { ReactComponent as DevelopersSvg } from '../../../assets/developes.svg'
import { RoutePath } from '../../../route/path'
import { RouterLink } from '../../RouterLink'

export enum InboxNavType {
  Inbox = 'Inbox',
  Subscription = 'Subscription',
  Developers = 'Developers',
}

interface NavItem {
  type: InboxNavType
  icon: ReactNode
  title: string
  to: RoutePath
}

const HStackContainer = styled(HStack)`
  &::-webkit-scrollbar {
    width: 0 !important;
    height: 0 !important;
  }

  overflow-y: hidden;
  overflow-x: auto;
  .wrap {
    font-weight: 700;
    font-size: 24px;
    line-height: 30px;
    cursor: pointer;
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

export const InboxNav: React.FC<{
  initialScrollX?: number
}> = ({ initialScrollX }) => {
  const { pathname } = useLocation()
  const [t] = useTranslation('inbox-nav')
  const navItems: NavItem[] = [
    {
      type: InboxNavType.Inbox,
      icon: <SVGInbox />,
      title: t('inbox'),
      to: RoutePath.Home,
    },
    {
      type: InboxNavType.Subscription,
      icon: <SVGInbox />,
      title: t('subscription'),
      to: RoutePath.Subscription,
    },
    {
      type: InboxNavType.Developers,
      icon: <DevelopersSvg />,
      title: t('developers'),
      to: RoutePath.Developers,
    },
  ]
  const containerRef = useRef<HTMLDivElement>(null)
  useDidMount(() => {
    if (initialScrollX && containerRef.current) {
      containerRef.current.scrollTo(initialScrollX, 0)
    }
  })

  return (
    <HStackContainer
      spacing={{ md: '80px', base: '40px' }}
      height="40px"
      ref={containerRef}
    >
      {navItems.map(({ icon, title, type, to }) => {
        const isActive = to === pathname
        return (
          <RouterLink key={type} href={to}>
            <Flex
              as="a"
              className="wrap"
              color={isActive ? '#000' : '#6f6f6f'}
              align="center"
            >
              {icon}
              <Box className={isActive ? 'box-cur' : ''} ml="5px">
                {title}
              </Box>
            </Flex>
          </RouterLink>
        )
      })}
    </HStackContainer>
  )
}
