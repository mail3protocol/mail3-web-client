import { Flex } from '@chakra-ui/react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLayoutStatus } from '../../hooks/useLayoutStatus'
import { HEADER_HEIGHT } from '../Header'
import {
  SidebarMenuItem,
  SidebarMenu,
  SidebarSubMenu,
  SidebarSubMenuItem,
} from '../SidebarMenus'
import { RoutePath } from '../../route/path'
import { ReactComponent as HomeIconSvg } from '../../assets/SidebarMenuIcons/home.svg'
import { ReactComponent as MessageIconSvg } from '../../assets/SidebarMenuIcons/message.svg'
import { ReactComponent as SubscribeIconSvg } from '../../assets/SidebarMenuIcons/subscribe.svg'

export const SIDEBAR_WIDTH = 256

export const Sidebar: React.FC = () => {
  const { isHiddenHeader } = useLayoutStatus()
  const { pathname } = useLocation()
  const { t } = useTranslation('components')

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
      <SidebarMenu>
        <SidebarMenuItem
          icon={<HomeIconSvg />}
          to={RoutePath.Dashboard}
          activeByPathname={pathname}
        >
          {t('sidebar.home')}
        </SidebarMenuItem>
        <SidebarSubMenu name={t('sidebar.message')} icon={<MessageIconSvg />}>
          <SidebarSubMenuItem
            to={RoutePath.SendRecords}
            activeByPathname={pathname}
          >
            {t('sidebar.send_records')}
          </SidebarSubMenuItem>
        </SidebarSubMenu>
        <SidebarSubMenu
          name={t('sidebar.subscribe')}
          icon={<SubscribeIconSvg />}
        >
          <SidebarSubMenuItem
            to={RoutePath.EarnNft}
            activeByPathname={pathname}
          >
            {t('sidebar.earn_nft')}
          </SidebarSubMenuItem>
        </SidebarSubMenu>
      </SidebarMenu>
    </Flex>
  )
}
