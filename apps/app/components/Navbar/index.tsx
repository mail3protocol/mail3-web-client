import React, { useRef } from 'react'
import {
  Center,
  Grid,
  Text,
  Flex,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Box,
  PopoverArrow,
  Button,
} from '@chakra-ui/react'
import Link from 'next/link'
import LogoSvg from 'assets/svg/logo.svg'
import { LinkButton } from 'ui'
import { useTranslation } from 'next-i18next'
import InboxSvg from '../../assets/inbox.svg'
import InboxWhiteSvg from '../../assets/inbox-white.svg'
import DraftSvg from '../../assets/drafts.svg'
import TrashSvg from '../../assets/trash.svg'
import SentSvg from '../../assets/sent.svg'
import SubscrptionSvg from '../../assets/subscrption.svg'
import { RoutePath } from '../../route/path'
import { ConnectWallet } from '../ConnectWallet'
import { ButtonList, ButtonListItemProps } from '../ButtonList'

export interface NavbarProps {
  showInbox?: boolean
}

const Logo = () => {
  const [t] = useTranslation('common')
  const btns: ButtonListItemProps[] = [
    {
      href: RoutePath.Drafts,
      label: t('navbar.drafts'),
      icon: <DraftSvg />,
    },
    {
      href: RoutePath.Trash,
      label: t('navbar.trash'),
      icon: <TrashSvg />,
    },
    {
      href: RoutePath.Inbox,
      label: t('navbar.subscriptions'),
      icon: <SubscrptionSvg />,
    },
  ]
  const popoverRef = useRef<HTMLDivElement>(null)
  return (
    <Popover arrowSize={18} autoFocus offset={[0, 10]} closeOnBlur>
      <PopoverTrigger>
        <Box>
          <Button variant="empty" _focus={{ boxShadow: 'none' }} padding="0">
            <LogoSvg />
          </Button>
        </Box>
      </PopoverTrigger>
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
                bg="white"
                height="66px"
                border="1px solid black"
                _hover={{
                  bg: 'rgba(78, 97, 245, 0.1)',
                }}
                as="a"
              >
                <Center flexDirection="column">
                  <SentSvg />
                  <Text>{t('navbar.sent')}</Text>
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

export const Navbar: React.FC<NavbarProps> = ({ showInbox = true }) => {
  const [t] = useTranslation('common')
  return (
    <Grid
      height="60px"
      w="100%"
      position="relative"
      templateColumns="200px calc(100% - 400px) 200px"
      boxSizing="border-box"
      padding="0 30px"
    >
      <Flex alignItems="center" justifyContent="flex-start">
        {showInbox ? (
          <Link href={RoutePath.Inbox} passHref>
            <LinkButton fontWeight="bold" fontSize="20px">
              <InboxSvg />
              <Text ml="4px">{t('navbar.inbox')}</Text>
            </LinkButton>
          </Link>
        ) : null}
      </Flex>
      <Center>
        <Logo />
      </Center>
      <Flex alignItems="center" justifyContent="flex-end">
        <ConnectWallet />
      </Flex>
    </Grid>
  )
}
