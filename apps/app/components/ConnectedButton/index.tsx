import {
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  Box,
  PopoverAnchor,
  usePopoverContext,
  Flex,
} from '@chakra-ui/react'
import { Button, Avatar } from 'ui'
import { useTranslation } from 'react-i18next'
import { useAtomValue } from 'jotai'
import React, { useMemo, useRef } from 'react'
import {
  PersonnalCenter,
  TrackEvent,
  TrackKey,
  useConnectWalletDialog,
  useToast,
  useTrackClick,
} from 'hooks'
import { truncateMiddle } from 'shared'
import { useEmailAddress } from '../../hooks/useEmailAddress'
import { ButtonList, ButtonListItemProps } from '../ButtonList'
import { RoutePath } from '../../route/path'
import { ReactComponent as SetupSvg } from '../../assets/setup.svg'
import { ReactComponent as ProfileSvg } from '../../assets/profile.svg'
import { ReactComponent as CopySvg } from '../../assets/copy.svg'
import { ReactComponent as ChangeWalletSvg } from '../../assets/change-wallet.svg'
import { copyText } from '../../utils'
import { userPropertiesAtom } from '../../hooks/useLogin'
import { HOME_URL, MAIL_SERVER_URL } from '../../constants'

const PopoverBodyWrapper: React.FC<{ address: string }> = ({ address }) => {
  const context = usePopoverContext()
  const userProps = useAtomValue(userPropertiesAtom)
  const trackItem = useTrackClick(TrackEvent.ClickPersonalCenter)
  const [t] = useTranslation('common')
  const emailAddress = useEmailAddress()
  const { onOpen } = useConnectWalletDialog()
  const toast = useToast()
  const btns: ButtonListItemProps[] = useMemo(
    () => [
      {
        href: RoutePath.SettingSignature,
        label: t('navbar.settings'),
        icon: <SetupSvg />,
        onClick() {
          context.onClose()
          trackItem({ [TrackKey.PersonnalCenter]: PersonnalCenter.Settings })
        },
      },
      {
        label: t('navbar.copy-address'),
        icon: <CopySvg />,
        async onClick() {
          context.onClose()
          trackItem({
            [TrackKey.PersonnalCenter]: PersonnalCenter.MyMail3Address,
          })
          const addr =
            userProps?.defaultAddress || `${address}@${MAIL_SERVER_URL}`
          await copyText(addr)
          toast(
            <Flex>
              {t('navbar.copied-to-clipboard')}:
              <Box fontWeight="bold"> {addr}</Box>
            </Flex>
          )
        },
      },
      {
        label: t('navbar.profile-link'),
        icon: <ProfileSvg />,
        async onClick() {
          const href = `${HOME_URL}/${
            userProps?.defaultAddress.substring(
              0,
              userProps.defaultAddress.indexOf('@')
            ) || address
          }`
          await copyText(href)
          toast(
            <Flex>
              {t('navbar.copied-to-clipboard')}
              <Box fontWeight="bold">{`${href}`}</Box>
            </Flex>
          )
          context.onClose()
          trackItem({
            [TrackKey.PersonnalCenter]: PersonnalCenter.MyProfileLink,
          })
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
  return <ButtonList items={btns} />
}

export const ConnectedButton: React.FC<{ address: string }> = ({ address }) => {
  const emailAddress = useEmailAddress()
  const popoverRef = useRef<HTMLElement>(null)
  const userProps = useAtomValue(userPropertiesAtom)

  const addr = useMemo(() => {
    const defaultAddress = userProps?.defaultAddress
    if (defaultAddress) {
      const [a, url] = defaultAddress.split('@')
      return `${truncateMiddle(a, 6, 4)}@${url}`
    }
    return emailAddress
  }, [userProps, emailAddress])

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
          <PopoverBodyWrapper address={address} />
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
