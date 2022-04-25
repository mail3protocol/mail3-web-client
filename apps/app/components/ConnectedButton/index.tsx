import {
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
import { useConnectWalletDialog, useToast } from 'hooks'
import { useEmailAddress } from '../../hooks/useEmailAddress'
import { ButtonList, ButtonListItemProps } from '../ButtonList'
import { RoutePath } from '../../route/path'
import SetupSvg from '../../assets/setup.svg'
import ProfileSvg from '../../assets/profile.svg'
import CopySvg from '../../assets/copy.svg'
import ChangeWalletSvg from '../../assets/change-wallet.svg'
import { copyText } from '../../utils'

export const ConnectedButton: React.FC<{ address: string }> = ({ address }) => {
  const emailAddress = useEmailAddress()
  const [t] = useTranslation('common')
  const toast = useToast()
  const popoverRef = useRef<HTMLElement>(null)
  const { onOpen } = useConnectWalletDialog()
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
        onOpen()
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
