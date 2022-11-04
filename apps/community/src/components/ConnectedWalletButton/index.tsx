import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  Button,
  Text,
  ButtonProps,
  useStyleConfig,
  PopoverAnchor,
  Box,
  TextProps,
  Icon,
  VStack,
  usePopoverContext,
} from '@chakra-ui/react'
import {
  useTrackClick,
  TrackEvent,
  TrackKey,
  CommunityClickCommunityPersonalcenterItem,
} from 'hooks'
import { Avatar, AvatarProps } from 'ui'
import { useTranslation } from 'react-i18next'
import { ReactComponent as InformationSvg } from 'assets/svg/information.svg'
import { ReactComponent as DisconnectSvg } from 'assets/svg/disconnect.svg'
import { ReactComponent as ChangeWalletSvg } from 'assets/svg/change_wallet.svg'
import { Link } from 'react-router-dom'
import { useLogout } from '../../hooks/useLogin'
import { useOpenConnectWalletDialog } from '../../hooks/useConnectWalletDialog'
import { RoutePath } from '../../route/path'
import { useUserInfo } from '../../hooks/useUserInfo'
import { formatUserName } from '../../utils/string'

export interface ConnectedWalletButtonProps extends ButtonProps {}

export const ConnectedWalletButtonMenu: React.FC<ButtonProps> = ({
  ...props
}) => {
  const context = usePopoverContext()
  const { t } = useTranslation('components')
  const logout = useLogout()
  const onOpenConnectWalletDialog = useOpenConnectWalletDialog()

  const trackClickCommunityPersonalCenterItem = useTrackClick(
    TrackEvent.CommunityClickCommunityPersonalcenter
  )

  return (
    <VStack
      spacing="6px"
      onClick={() => {
        context?.onClose()
      }}
    >
      <Button
        as={Link}
        to={RoutePath.Information}
        variant="unstyled"
        onClick={() => {
          trackClickCommunityPersonalCenterItem({
            [TrackKey.CommunityClickCommunityPersonalcenterItem]:
              CommunityClickCommunityPersonalcenterItem.Information,
          })
        }}
        {...props}
      >
        <Icon w="20px" h="20px" as={InformationSvg} mr="8px" />
        {t('connect_wallet_button.information')}
      </Button>
      <Button
        variant="unstyled"
        {...props}
        onClick={() => {
          trackClickCommunityPersonalCenterItem({
            [TrackKey.CommunityClickCommunityPersonalcenterItem]:
              CommunityClickCommunityPersonalcenterItem.ChangeWallet,
          })
          return onOpenConnectWalletDialog()
        }}
      >
        <Icon w="20px" h="20px" as={ChangeWalletSvg} mr="8px" />
        {t('connect_wallet_button.change_wallet')}
      </Button>
      <Button
        variant="unstyled"
        {...props}
        onClick={() => {
          trackClickCommunityPersonalCenterItem({
            [TrackKey.CommunityClickCommunityPersonalcenterItem]:
              CommunityClickCommunityPersonalcenterItem.Disconnect,
          })
          return logout()
        }}
      >
        <Icon w="20px" h="20px" as={DisconnectSvg} mr="8px" />
        {t('connect_wallet_button.disconnect')}
      </Button>
    </VStack>
  )
}

export const ConnectedWalletButton: React.FC<ConnectedWalletButtonProps> = ({
  ...props
}) => {
  const userInfo = useUserInfo()
  const {
    avatar: avatarProps,
    text: textProps,
    listItem: listItemProps,
    ...defaultProps
  } = useStyleConfig(
    'ConnectedWalletButton',
    {},
    { isMultiPart: true }
  ) as unknown as ButtonProps & {
    avatar: Omit<AvatarProps, 'address'>
    text: TextProps
    listItem: ButtonProps
  }

  if (!userInfo?.address) return null

  return (
    <Popover arrowShadowColor="none" arrowSize={16}>
      <PopoverTrigger>
        <Button display="flex" variant="unstyled" {...defaultProps} {...props}>
          <PopoverAnchor>
            <Box>
              <Avatar
                borderRadius="50%"
                address={userInfo?.address.split('@')[0]}
                {...avatarProps}
              />
            </Box>
          </PopoverAnchor>
          <Text {...textProps}>{formatUserName(userInfo.name)}</Text>
        </Button>
      </PopoverTrigger>
      <PopoverContent w="204px" top="10px">
        <PopoverArrow />
        <PopoverBody py="16px" px="8px">
          <ConnectedWalletButtonMenu {...listItemProps} />
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
