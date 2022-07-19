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
import { Logo as UiLogo } from 'ui'
import { ReactComponent as InboxWhiteSvg } from '../../assets/inbox-white.svg'
import { ReactComponent as DraftSvg } from '../../assets/drafts.svg'
import { ReactComponent as TrashSvg } from '../../assets/trash.svg'
import { ReactComponent as SentSvg } from '../../assets/sent.svg'
import { ReactComponent as SubscrptionSvg } from '../../assets/subscrption.svg'
import { RoutePath } from '../../route/path'
import { ButtonList, ButtonListItemProps } from '../ButtonList'
import { ConnectedButton } from '../ConnectedButton'
import { NAVBAR_HEIGHT } from '../../constants'
import { Auth, AuthModal } from '../Auth'
import { RouterLink } from '../RouterLink'
import { ConnectWallet } from '../ConnectWallet'

export interface NavbarProps {
  showInbox?: boolean
}

const LogoButton = styled(Button)`
  .triangle {
    margin-left: 3px;
  }
`

const LogoPopoverBody: React.FC = () => {
  const [t] = useTranslation('common')
  const trackMenuClick = useTrackClick(TrackEvent.ClickMail3Menu)
  const context = usePopoverContext()
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
                [TrackKey.Mail3MenuItem]: Mail3MenuItem.Subscription,
              })
            }}
            border="1px solid black"
            _hover={{
              bg: '#E7E7E7',
            }}
            as="a"
          >
            <Center flexDirection="column">
              <SubscrptionSvg />
              <Text>{t('navbar.subscriptions')}</Text>
            </Center>
          </Button>
        </RouterLink>
      </Center>
      <Text color="#7e7e7e" fontWeight={700} fontSize="18px" mb="6px">
        {t('navbar.other-stuff')}
      </Text>
      <ButtonList items={btns} />
    </>
  )
}

const Logo = () => {
  const isConnected = !!useAccount()
  const logoEl = <UiLogo textProps={{ color: '#231815' }} />
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
        boxShadow="0px 0px 16px 12px rgba(192, 192, 192, 0.25)"
      >
        <PopoverArrow />
        <PopoverBody padding="20px 16px 30px 16px">
          <LogoPopoverBody />
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

const NavbarContainer = styled(Flex)`
  justify-content: center;
  height: ${NAVBAR_HEIGHT}px;
  width: 100%;
  align-items: center;
  position: relative;

  @media (max-width: 600px) {
    justify-content: flex-start;
  }
`

export const Navbar: React.FC<NavbarProps> = () => (
  <NavbarContainer>
    <Flex alignItems="center">
      <Logo />
    </Flex>
    <Flex alignItems="center" position="absolute" right={0}>
      <ConnectWallet
        renderConnected={(address) => <ConnectedButton address={address} />}
      />
    </Flex>
    <AuthModal />
    <Auth />
  </NavbarContainer>
)
