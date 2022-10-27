import { Flex, Icon } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { useLayoutStatus } from '../../hooks/useLayoutStatus'
import { HEADER_HEIGHT } from '../Header'
import { SidebarMenus } from '../SidebarMenus/SidebarMenus'
import { RoutePath } from '../../route/path'
import { ReactComponent as HomeSvg } from '../../assets/SidebarMenuIcons/home.svg'
import { ReactComponent as MessageSvg } from '../../assets/SidebarMenuIcons/message.svg'
import { ReactComponent as SubscribeSvg } from '../../assets/SidebarMenuIcons/subscribe.svg'

export const SIDEBAR_WIDTH = 256

export const Sidebar: React.FC = () => {
  const { isHiddenHeader } = useLayoutStatus()
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
      <SidebarMenus
        menus={[
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
                {t('sidebar.message')}
              </>
            ),
            key: 'message',
            children: [
              {
                label: t('sidebar.send_records'),
                to: RoutePath.SendRecords,
                key: 'send_records',
              },
            ],
          },
          {
            label: (
              <>
                <Icon as={SubscribeSvg} w="16px" h="16px" mr="4px" />
                {t('sidebar.subscribe')}
              </>
            ),
            key: 'subscribe',
            children: [
              {
                label: t('sidebar.earn_nft'),
                to: RoutePath.EarnNft,
                key: 'earn_nft',
              },
            ],
          },
        ]}
      />
    </Flex>
  )
}
