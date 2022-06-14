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
import { useAtomValue } from 'jotai'
import React, { useMemo, useRef, useState } from 'react'
import {
  PersonnalCenter,
  TrackEvent,
  TrackKey,
  useConnectWalletDialog,
  useDidMount,
  useToast,
  useTrackClick,
} from 'hooks'
import { useEmailAddress } from '../../hooks/useEmailAddress'
import { ButtonList, ButtonListItemProps } from '../ButtonList'
import { RoutePath } from '../../route/path'
import SetupSvg from '../../assets/setup.svg'
import ProfileSvg from '../../assets/profile.svg'
import CopySvg from '../../assets/copy.svg'
import ChangeWalletSvg from '../../assets/change-wallet.svg'
import { copyText, truncateMiddle } from '../../utils'
import { userPropertiesAtom } from '../../hooks/useLogin'

export const ConnectedButton: React.FC<{ address: string }> = ({ address }) => {
  const emailAddress = useEmailAddress()
  const [t] = useTranslation('common')
  const toast = useToast()
  const popoverRef = useRef<HTMLElement>(null)
  const { onOpen } = useConnectWalletDialog()
  const userProps = useAtomValue(userPropertiesAtom)
  const trackItem = useTrackClick(TrackEvent.ClickPersonalCenter)
  const btns: ButtonListItemProps[] = useMemo(
    () => [
      {
        href: RoutePath.SettingSignature,
        label: t('navbar.settings'),
        icon: <SetupSvg />,
        onClick() {
          trackItem({ [TrackKey.PersonnalCenter]: PersonnalCenter.Settings })
        },
      },
      {
        href: `https://mail3.me/${address}`,
        label: t('navbar.profile'),
        icon: <ProfileSvg />,
        isExternal: true,
        onClick() {
          trackItem({ [TrackKey.PersonnalCenter]: PersonnalCenter.Profile })
        },
      },
      {
        label: t('navbar.copy-address'),
        icon: <CopySvg />,
        async onClick() {
          trackItem({ [TrackKey.PersonnalCenter]: PersonnalCenter.CopyAddress })
          const addr = userProps?.defaultAddress || emailAddress
          await copyText(addr)
          toast(t('navbar.copied'))
          popoverRef?.current?.blur()
        },
      },
      {
        label: t('navbar.change-wallet'),
        icon: <ChangeWalletSvg />,
        onClick() {
          trackItem({
            [TrackKey.PersonnalCenter]: PersonnalCenter.ChangeWallet,
          })
          onOpen()
        },
      },
    ],
    [address, userProps, emailAddress]
  )

  const [mounted, setMounted] = useState(false)

  useDidMount(() => {
    setMounted(true)
  })

  const addr = useMemo(() => {
    const defaultAddress = userProps?.defaultAddress
    if (defaultAddress) {
      const [a, url] = defaultAddress.split('@')
      return `${truncateMiddle(a, 6, 4)}@${url}`
    }
    return emailAddress
  }, [userProps, emailAddress])

  if (!mounted) {
    return null
  }

  return (
    <Popover
      arrowSize={18}
      autoFocus
      offset={[0, 20]}
      closeOnBlur
      strategy="fixed"
    >
      <PopoverTrigger>
        <Box cursor="pointer">
          <Button
            variant="outline"
            paddingLeft="6px"
            paddingRight="6px"
            minH="40px"
          >
            <PopoverAnchor>
              <Box>
                <Avatar w="32px" h="32px" address={address} />
              </Box>
            </PopoverAnchor>
            <Text ml="6px" fontSize="12px" fontWeight="normal">
              {addr}
            </Text>
          </Button>
        </Box>
      </PopoverTrigger>
      <PopoverContent
        _focus={{
          boxShadow: '0px 0px 16px 12px rgba(192, 192, 192, 0.25)',
          outline: 'none',
        }}
        w="250px"
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
