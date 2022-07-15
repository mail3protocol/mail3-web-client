import React from 'react'
import { PageContainer } from 'ui'
import { useTranslation } from 'react-i18next'
import { Center, Heading } from '@chakra-ui/react'
import { RoutePath } from '../../route/path'
import { SettingContainer } from '../../components/Settings/SettingContainer'
import { Tabs, Tab } from '../../components/Tabs'
import { SettingSignature } from '../../components/Settings/SettingSignature'
import { useRedirectHome } from '../../hooks/useRedirectHome'
import { RouterLink } from '../../components/RouterLink'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

export const SettingsSignaturePage = () => {
  const [t] = useTranslation('settings')
  const { isAuth, redirectHome } = useRedirectHome()
  useDocumentTitle('Setting Signature')
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
          <RouterLink href={RoutePath.Settings}>
            <Tab as="a" isActive={false}>
              {t('settings.tabs.address')}
            </Tab>
          </RouterLink>
          <RouterLink href={RoutePath.SettingSignature}>
            <Tab as="a" isActive>
              {t('settings.tabs.signature')}
            </Tab>
          </RouterLink>
        </Tabs>
        <SettingSignature />
      </SettingContainer>
    </PageContainer>
  )
}
