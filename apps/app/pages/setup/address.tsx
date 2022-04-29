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
import { SettingAddress } from '../../components/Settings/SettingAddress'
import { SettingContainer } from '../../components/Settings/SettingContainer'

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, ['settings', 'common'])),
  },
})

const SetupAddressPage: NextPage = () => {
  const [t] = useTranslation('settings')
  return (
    <PageContainer>
      <Navbar />
      <SettingContainer>
        <Center position="relative" w="100%" mb="20px" mt="40px">
          <Heading>{t('setup.address.title')}</Heading>
          <Link href={RoutePath.SetupSignature} passHref>
            <Button
              bg="black"
              color="white"
              flex="1"
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
        <SettingAddress />
      </SettingContainer>
    </PageContainer>
  )
}

export default SetupAddressPage
