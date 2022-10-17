import React from 'react'
import {
  Center,
  Text,
  Flex,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  Button,
  usePopoverContext,
  HStack,
  Link,
  Box,
  Badge,
} from '@chakra-ui/react'
import styled from '@emotion/styled'
import { ReactComponent as DownTriangleSvg } from 'assets/svg/triangle-down.svg'
import { useTranslation } from 'react-i18next'
import {
  Mail3MenuItem,
  TrackEvent,
  TrackKey,
  useAccount,
  useTrackClick,
} from 'hooks'
import { DiscordIcon, Logo as UiLogo, MirrorIcon, TwitterIcon } from 'ui'
import { useQuery } from 'react-query'
import { atom, useAtomValue } from 'jotai'
import { useUpdateAtom } from 'jotai/utils'
import {
  DISCORD_URL,
  MIRROR_URL,
  TWITTER_URL,
  NAVBAR_HEIGHT,
} from '../../constants'
import { ReactComponent as InboxWhiteSvg } from '../../assets/inbox-white.svg'
import { ReactComponent as DraftSvg } from '../../assets/drafts.svg'
import { ReactComponent as TrashSvg } from '../../assets/trash.svg'
import { ReactComponent as SpamSvg } from '../../assets/spam.svg'
import { ReactComponent as SentSvg } from '../../assets/sent.svg'
import { ReactComponent as SubscriptionSvg } from '../../assets/subscription.svg'
import { RoutePath } from '../../route/path'
import { ButtonList, ButtonListItemProps } from '../ButtonList'
import { ConnectedButton } from '../ConnectedButton'
import { Auth, AuthModal } from '../Auth'
import { RouterLink } from '../RouterLink'
import { ConnectWallet } from '../ConnectWallet'
import { NotificationSwitch } from '../NotificationSwitch'
import { useAPI } from '../../hooks/useAPI'

export interface NavbarProps {
  showInbox?: boolean
}

const LogoButton = styled(Button)`
  .triangle {
    margin-left: 3px;
  }
`

export const SubscribeUnreadCountAtom = atom(0)

const LogoPopoverBody: React.FC = () => {
  const [t] = useTranslation('common')
  const trackMenuClick = useTrackClick(TrackEvent.ClickMail3Menu)
  const context = usePopoverContext()
  const unreadCount = useAtomValue(SubscribeUnreadCountAtom)
  const btns: ButtonListItemProps[] = [
    {
      href: RoutePath.Drafts,
      label: t('navbar.drafts'),
      icon: <DraftSvg />,
      onClick() {
        context.onClose()
        trackMenuClick({ [TrackKey.Mail3MenuItem]: Mail3MenuItem.Drafts })
      },
    },
    {
      href: RoutePath.Sent,
      label: t('navbar.sent'),
      icon: <SentSvg />,
      onClick() {
        context.onClose()
        trackMenuClick({ [TrackKey.Mail3MenuItem]: Mail3MenuItem.Sent })
      },
    },
    {
      href: RoutePath.Trash,
      label: t('navbar.trash'),
      icon: <TrashSvg />,
      onClick() {
        context.onClose()
        trackMenuClick({ [TrackKey.Mail3MenuItem]: Mail3MenuItem.Trash })
      },
    },
    {
      href: RoutePath.Spam,
      label: t('navbar.spam'),
      icon: <SpamSvg />,
      onClick() {
        context.onClose()
        trackMenuClick({ [TrackKey.Mail3MenuItem]: Mail3MenuItem.Spam })
      },
    },
  ]
  return (
    <>
      <Center flexDirection="row" mb="14px">
        <RouterLink href={RoutePath.Inbox} passHref>
          <Button
            bg="black"
            color="white"
            height="66px"
            borderRadius="16px"
            flex="1"
            onClick={() => {
              context.onClose()
              trackMenuClick({
                [TrackKey.Mail3MenuItem]: Mail3MenuItem.Inbox,
              })
            }}
            _hover={{
              bg: 'brand.50',
            }}
            as="a"
          >
            <Center flexDirection="column">
              <InboxWhiteSvg />
              <Text>{t('navbar.inbox')}</Text>
            </Center>
          </Button>
        </RouterLink>
        <RouterLink href={RoutePath.Subscription} passHref>
          <Button
            flex="1"
            ml="9px"
            borderRadius="16px"
            bg="white"
            height="66px"
            onClick={() => {
              context.onClose()
              trackMenuClick({
                [TrackKey.Mail3MenuItem]: Mail3MenuItem.Sent,
              })
            }}
            border="1px solid black"
            _hover={{
              bg: '#E7E7E7',
            }}
            as="a"
          >
            <Center flexDirection="column">
              <Box position="relative">
                <SubscriptionSvg />
                <Badge
                  top="0"
                  left="20px"
                  minW="20px"
                  position="absolute"
                  h="16px"
                  lineHeight="16px"
                  fontSize="10px"
                  bg="#4E51F4"
                  color="#fff"
                  fontWeight={700}
                  borderRadius="27px"
                  textAlign="center"
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Badge>
              </Box>
              <Text>{t('navbar.subscription')}</Text>
            </Center>
          </Button>
        </RouterLink>
      </Center>
      <Text color="#7e7e7e" fontWeight={700} fontSize="18px" mb="6px">
        {t('navbar.other-stuff')}
      </Text>
      <ButtonList items={btns} />
      <HStack
        borderTop="1px solid #F3F3F3"
        spacing="40px"
        justifyContent="center"
        pt="16px"
        mt="20px"
        css={`
          .item {
            width: 20px;
            height: 22px;
            color: #000;
            display: inline-flex;
            justify-content: center;
            align-items: center;
          }
          .item:hover {
            transform: scale(1.1);
          }
        `}
      >
        <Link
          className="item"
          href={TWITTER_URL}
          target="_blank"
          onClick={() => {
            context.onClose()
            trackMenuClick({
              [TrackKey.Mail3MenuItem]: Mail3MenuItem.Twitter,
            })
          }}
        >
          <TwitterIcon w="20px" h="22px" />
        </Link>
        <Link
          className="item"
          href={DISCORD_URL}
          target="_blank"
          onClick={() => {
            context.onClose()
            trackMenuClick({
              [TrackKey.Mail3MenuItem]: Mail3MenuItem.Discord,
            })
          }}
        >
          <DiscordIcon w="20px" h="22px" />
        </Link>
        <Link
          className="item"
          href={MIRROR_URL}
          target="_blank"
          onClick={() => {
            context.onClose()
            trackMenuClick({
              [TrackKey.Mail3MenuItem]: Mail3MenuItem.Mirror,
            })
          }}
        >
          <MirrorIcon w="20px" h="22px" />
        </Link>
      </HStack>
    </>
  )
}

const Logo = () => {
  const api = useAPI()
  const setUnreadCount = useUpdateAtom(SubscribeUnreadCountAtom)
  useQuery(
    ['subscribeMessageCount'],
    async () => {
      const { data } = await api.SubscriptionMessageStats()
      setUnreadCount(data?.unread_count ?? 0)
    },
    {
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchInterval: 10000,
    }
  )

  const isConnected = !!useAccount()
  const logoEl = (
    <UiLogo
      textProps={{
        color: '#231815',
        display: { base: 'none', sm: 'inline-block' },
      }}
    />
  )
  const popoverTrigger = isConnected ? (
    <PopoverTrigger>
      <Center>
        <LogoButton variant="empty" _focus={{ boxShadow: 'none' }} padding="0">
          {logoEl}
          <DownTriangleSvg className="triangle" />
        </LogoButton>
      </Center>
    </PopoverTrigger>
  ) : (
    <Center width="100px">{logoEl}</Center>
  )
  return (
    <Popover arrowSize={18} autoFocus offset={[0, 10]} closeOnBlur>
      {popoverTrigger}
      <PopoverContent
        _focus={{
          boxShadow: '0px 0px 16px 12px rgba(192, 192, 192, 0.25)',
          outline: 'none',
        }}
        border="none"
        borderRadius="12px"
        boxShadow="0 0 16px 12px rgba(192, 192, 192, 0.25)"
      >
        <PopoverArrow />
        <PopoverBody padding="20px 16px 16px 16px">
          <LogoPopoverBody />
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

const NavbarContainer = styled(Flex)`
  height: ${NAVBAR_HEIGHT}px;
  width: 100%;
  align-items: center;
  position: relative;
`

export const Navbar: React.FC<NavbarProps> = () => (
  <NavbarContainer justifyContent={{ base: 'flex-start', md: 'center' }}>
    <Flex alignItems="center">
      <Logo />
    </Flex>
    <Flex alignItems="center" position="absolute" right={0}>
      <Flex pr="15px">
        <NotificationSwitch />
      </Flex>
      <ConnectWallet
        renderConnected={(address) => <ConnectedButton address={address} />}
      />
    </Flex>
    <AuthModal />
    <Auth />
  </NavbarContainer>
)
