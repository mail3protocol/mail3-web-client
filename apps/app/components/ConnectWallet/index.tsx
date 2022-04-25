import {
  useDisclosure,
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  Box,
  PopoverAnchor,
} from '@chakra-ui/react'
import { Button, Avatar } from 'ui'
import { useTranslation } from 'next-i18next'
import React, { useRef } from 'react'
import { useDidMount, useToast, ConfirmDialog } from 'hooks'
import { CurrentConnector } from '../../connectors'
import { ConenctModal } from './ConnectModal'
import { useEmailAddress } from '../../hooks/useEmailAddress'
import { ButtonList, ButtonListItemProps } from '../ButtonList'
import { RoutePath } from '../../route/path'
import SetupSvg from '../../assets/setup.svg'
import ProfileSvg from '../../assets/profile.svg'
import CopySvg from '../../assets/copy.svg'
import ChangeWalletSvg from '../../assets/change-wallet.svg'
import { copyText } from '../../utils'

const { usePriorityConnector, usePriorityIsActivating, usePriorityAccount } =
  CurrentConnector
interface ConnectedButtonProps {
  address: string
  onOpenConnectWallet: () => void
}

const ConnectedButton: React.FC<ConnectedButtonProps> = ({
  address,
  onOpenConnectWallet,
}) => {
  const emailAddress = useEmailAddress()
  const [t] = useTranslation('common')
  const toast = useToast()
  const popoverRef = useRef<HTMLElement>(null)
  const btns: ButtonListItemProps[] = [
    {
      href: RoutePath.Settings,
      label: t('navbar.settings'),
      icon: <SetupSvg />,
    },
    {
      href: `https://mail3.me/${address}`,
      label: t('navbar.profile'),
      icon: <ProfileSvg />,
      isExternal: true,
    },
    {
      label: t('navbar.copy-address'),
      icon: <CopySvg />,
      async onClick() {
        await copyText(address)
        toast(t('navbar.copied'))
        popoverRef?.current?.blur()
      },
    },
    {
      label: t('navbar.change-wallet'),
      icon: <ChangeWalletSvg />,
      onClick() {
        onOpenConnectWallet()
      },
    },
  ]

  return (
    <Popover arrowSize={18} autoFocus offset={[0, 20]} closeOnBlur>
      <PopoverTrigger>
        <Box cursor="pointer">
          <Button variant="outline">
            <PopoverAnchor>
              <Box>
                <Avatar w="32px" h="32px" address={address} />
              </Box>
            </PopoverAnchor>
            <Text ml="6px" fontSize="12px">
              {emailAddress}
            </Text>
          </Button>
        </Box>
      </PopoverTrigger>
      <PopoverContent
        _focus={{
          boxShadow: '0px 0px 16px 12px rgba(192, 192, 192, 0.25)',
          outline: 'none',
        }}
        w="220px"
        border="none"
        borderRadius="12px"
        boxShadow="0px 0px 16px 12px rgba(192, 192, 192, 0.25)"
        ref={popoverRef}
      >
        <PopoverArrow />
        <PopoverBody padding="20px 16px 20px 16px">
          <ButtonList items={btns} />
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

export const ConnectWallet: React.FC = () => {
  const [t] = useTranslation('connect')
  const connector = usePriorityConnector()
  const IsActivating = usePriorityIsActivating()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const account = usePriorityAccount()
  useDidMount(() => {
    connector.connectEagerly?.()
  })

  return (
    <>
      {account ? (
        <ConnectedButton address={account} onOpenConnectWallet={onOpen} />
      ) : (
        <Button
          onClick={onOpen}
          isDisabled={IsActivating}
          isLoading={IsActivating}
          loadingText={t('connecting')}
        >
          {t('connect-wallet')}
        </Button>
      )}
      <ConfirmDialog />
      <ConenctModal isOpen={isOpen} onClose={onClose} />
    </>
  )
}
