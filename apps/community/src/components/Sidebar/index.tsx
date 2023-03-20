import { Flex, Icon } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

import { useLayoutStatus } from '../../hooks/useLayoutStatus'
import { HEADER_HEIGHT } from '../Header'
import { SidebarMenus, SidebarMenusProps } from '../SidebarMenus/SidebarMenus'
import { RoutePath } from '../../route/path'
import { ReactComponent as HomeSvg } from '../../assets/SidebarMenuIcons/home.svg'
import { ReactComponent as MessageSvg } from '../../assets/SidebarMenuIcons/message.svg'
import { ReactComponent as EditorSvg } from '../../assets/SidebarMenuIcons/editors.svg'
import { ReactComponent as SubscribeSvg } from '../../assets/SidebarMenuIcons/subscribe.svg'
import { ReactComponent as DiamondsSvg } from '../../assets/SidebarMenuIcons/diamonds.svg'
import { useIsAdmin } from '../../hooks/useAdmin'

export const SIDEBAR_WIDTH = 196

export const Sidebar: React.FC = () => {
  const { isHiddenHeader } = useLayoutStatus()
  const { t } = useTranslation('components')
  const isAdmin = useIsAdmin()
  const menus: SidebarMenusProps['menus'] = [
    {
      label: (
        <>
          <Icon as={HomeSvg} w="16px" h="16px" mr="4px" />
          {t('sidebar.home')}
        </>
      ),
      to: RoutePath.Dashboard,
      key: 'home',
    },
    {
      label: (
        <>
          <Icon as={MessageSvg} w="16px" h="16px" mr="4px" />
          {t('sidebar.published')}
        </>
      ),
      key: 'published',
      to: RoutePath.Published,
    },
    {
      label: (
        <>
          <Icon as={EditorSvg} w="16px" h="16px" mr="4px" />
          {t('sidebar.editors')}
        </>
      ),
      key: 'editors',
      to: RoutePath.CoAuthors,
    },
    {
      label: (
        <>
          <Icon as={SubscribeSvg} w="16px" h="16px" mr="4px" />
          {t('sidebar.nft_reward')}
        </>
      ),
      to: RoutePath.EarnNft,
      key: 'nft_reward',
    },
    ...(isAdmin
      ? [
          {
            label: (
              <>
                <Icon as={DiamondsSvg} w="16px" h="16px" mr="4px" />
                {t('sidebar.premium')}
              </>
            ),
            to: RoutePath.Premium,
            key: 'premium',
          },
        ]
      : []),
  ]

  return (
    <Flex
      w={`${SIDEBAR_WIDTH}px`}
      h="100vh"
      shadow="sidebar"
      position="fixed"
      top={isHiddenHeader ? '0' : `${HEADER_HEIGHT}px`}
      left="0"
      bg="sidebarBackground"
      {...(isHiddenHeader ? {} : { pt: `${HEADER_HEIGHT}px` })}
      pt="40px"
      px="18px"
      zIndex="sidebar"
    >
      <SidebarMenus menus={menus} />
    </Flex>
  )
}
