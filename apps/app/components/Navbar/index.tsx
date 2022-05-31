import React, { useRef } from 'react'
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
  Icon,
} from '@chakra-ui/react'
import Link from 'next/link'
import styled from '@emotion/styled'
import LogoSvg from 'assets/svg/logo-pure.svg'
import DownTriangleSvg from 'assets/svg/triangle-down.svg'
import { useTranslation } from 'next-i18next'
import { ConnectWallet } from 'ui'
import { useAccount } from 'hooks'
import InboxWhiteSvg from '../../assets/inbox-white.svg'
import DraftSvg from '../../assets/drafts.svg'
import TrashSvg from '../../assets/trash.svg'
import SentSvg from '../../assets/sent.svg'
import SubscrptionSvg from '../../assets/subscrption.svg'
import { RoutePath } from '../../route/path'
import { ButtonList, ButtonListItemProps } from '../ButtonList'
import { ConnectedButton } from '../ConnectedButton'
import { NAVBAR_HEIGHT } from '../../constants'
import { Auth, AuthModal } from '../Auth'

export interface NavbarProps {
  showInbox?: boolean
}

const LogoButton = styled(Button)`
  .triangle {
    margin-left: 3px;
  }
`

const Logo = () => {
  const [t] = useTranslation('common')
  const btns: ButtonListItemProps[] = [
    {
      href: RoutePath.Drafts,
      label: t('navbar.drafts'),
      icon: <DraftSvg />,
    },
    {
      href: RoutePath.Sent,
      label: t('navbar.sent'),
      icon: <SentSvg />,
    },
    {
      href: RoutePath.Trash,
      label: t('navbar.trash'),
      icon: <TrashSvg />,
    },
  ]
  const popoverRef = useRef<HTMLDivElement>(null)
  const isConnected = !!useAccount()
  const popoverTrigger = isConnected ? (
    <PopoverTrigger>
      <Center>
        <LogoButton variant="empty" _focus={{ boxShadow: 'none' }} padding="0">
          <Icon as={LogoSvg} w="auto" h="auto" />
          <DownTriangleSvg className="triangle" />
        </LogoButton>
      </Center>
    </PopoverTrigger>
  ) : (
    <Center width="100px">
      <Icon as={LogoSvg} w="auto" h="auto" />
    </Center>
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
        ref={popoverRef}
        boxShadow="0px 0px 16px 12px rgba(192, 192, 192, 0.25)"
      >
        <PopoverArrow />
        <PopoverBody padding="20px 16px 30px 16px">
          <Center flexDirection="row" mb="14px">
            <Link href={RoutePath.Inbox} passHref>
              <Button
                bg="black"
                color="white"
                height="66px"
                borderRadius="16px"
                flex="1"
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
            </Link>
            <Link href={RoutePath.Sent} passHref>
              <Button
                flex="1"
                ml="9px"
                borderRadius="16px"
                bg="white"
                height="66px"
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
            </Link>
          </Center>
          <Text color="#e7e7e7" fontWeight={700} fontSize="18px" mb="6px">
            {t('navbar.other-stuff')}
          </Text>
          <ButtonList items={btns} />
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
