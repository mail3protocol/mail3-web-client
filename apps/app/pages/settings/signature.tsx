import React from 'react'
import type { NextPage, GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { PageContainer } from 'ui'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { Center, Heading } from '@chakra-ui/react'
import { Navbar } from '../../components/Navbar'
import { RoutePath } from '../../route/path'
import { SettingContainer } from '../../components/Settings/SettingContainer'
import { Tabs, Tab } from '../../components/Tabs'
import { SettingSignature } from '../../components/Settings/SettingSignature'
import { getAuthenticateProps } from '../../hooks/useLogin'

export const getServerSideProps: GetServerSideProps = getAuthenticateProps(
  async ({ locale }) => ({
    props: {
      ...(await serverSideTranslations(locale as string, [
        'settings',
        'common',
      ])),
    },
  })
)

const SettingsAddressPage: NextPage = () => {
  const [t] = useTranslation('settings')
  return (
    <PageContainer>
      <Navbar />
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
          <Link href={RoutePath.Settings} passHref>
            <Tab as="a" isActive={false}>
              {t('settings.tabs.address')}
            </Tab>
          </Link>
          <Link href={RoutePath.SettingSignature} passHref>
            <Tab as="a" isActive>
              {t('settings.tabs.signature')}
            </Tab>
          </Link>
        </Tabs>
        <SettingSignature />
      </SettingContainer>
    </PageContainer>
  )
}

export default SettingsAddressPage
