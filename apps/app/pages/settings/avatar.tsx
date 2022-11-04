import React from 'react'
import { PageContainer } from 'ui'
import { useTranslation } from 'react-i18next'
import { Center, Heading } from '@chakra-ui/react'
import { RoutePath } from '../../route/path'
import { SettingAvatar } from '../../components/Settings/SettingAvatar'
import { SettingContainer } from '../../components/Settings/SettingContainer'
import { Tabs, Tab } from '../../components/Tabs'
import { useRedirectHome } from '../../hooks/useRedirectHome'
import { RouterLink } from '../../components/RouterLink'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

export const SettingsAvatarPage = () => {
  const [t] = useTranslation('settings')
  const { redirectHome, isAuth } = useRedirectHome()
  useDocumentTitle('Set your Avatar')
  if (!isAuth) {
    return redirectHome()
  }

  return (
    <PageContainer>
      <SettingContainer>
        <Center
          position="relative"
          w="100%"
          mb="20px"
          mt={['20px', '20px', '40px']}
        >
          <Heading fontSize={['20px', '20px', '28px']}>
            {t('settings.title')}
          </Heading>
        </Center>
        <Tabs mb="32px">
          <RouterLink href={RoutePath.Settings} passHref>
            <Tab as="a" isActive={false}>
              {t('settings.tabs.address')}
            </Tab>
          </RouterLink>
          <RouterLink href={RoutePath.Settings} passHref>
            <Tab as="a" isActive>
              {t('settings.tabs.avatar')}
            </Tab>
          </RouterLink>
          <RouterLink href={RoutePath.SettingSignature} passHref>
            <Tab as="a" isActive={false}>
              {t('settings.tabs.signature')}
            </Tab>
          </RouterLink>
        </Tabs>
        <SettingAvatar />
      </SettingContainer>
    </PageContainer>
  )
}
