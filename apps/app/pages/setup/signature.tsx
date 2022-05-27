import React from 'react'
import type { NextPage, GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Button, PageContainer } from 'ui'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { Center, Heading, Text } from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons'
import { Navbar } from '../../components/Navbar'
import { RoutePath } from '../../route/path'
import { SettingSignature } from '../../components/Settings/SettingSignature'
import { SettingContainer } from '../../components/Settings/SettingContainer'
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

const SetupSignaturePage: NextPage = () => {
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
            {t('setup.signature.title')}
          </Heading>
          <Link href={RoutePath.Inbox} passHref>
            <Button
              bg="black"
              color="white"
              className="next-header"
              position="absolute"
              right="60px"
              _hover={{
                bg: 'brand.50',
              }}
              as="a"
              rightIcon={<ChevronRightIcon color="white" />}
            >
              <Center flexDirection="column">
                <Text>{t('setup.next')}</Text>
              </Center>
            </Button>
          </Link>
        </Center>
        <SettingSignature />
      </SettingContainer>
    </PageContainer>
  )
}

export default SetupSignaturePage
