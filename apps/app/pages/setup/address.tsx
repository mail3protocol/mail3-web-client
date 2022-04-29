import React from 'react'
import type { NextPage, GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Button, PageContainer } from 'ui'
import { useTranslation } from 'next-i18next'
import styled from '@emotion/styled'
import Link from 'next/link'
import { Center, Heading, Text, Flex } from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons'
import { Navbar } from '../../components/Navbar'
import { NAVBAR_GUTTER, NAVBAR_HEIGHT } from '../../constants'
import { RoutePath } from '../../route/path'
import { SettingAddress } from '../../components/Settings/SettingAddress'

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, ['settings', 'common'])),
  },
})

const MainContainer = styled(Flex)`
  margin-top: ${NAVBAR_GUTTER}px;
  margin-bottom: 30px;
  border-radius: 24px;
  min-height: calc(100vh - ${NAVBAR_GUTTER + NAVBAR_HEIGHT + 30}px);
  background-color: white;
  box-shadow: 0px 0px 10px 4px rgba(25, 25, 100, 0.1);
  flex-direction: column;
  @media (max-width: 600px) {
    border-radius: 0;
    box-shadow: none;

    .next-header {
      display: none;
    }
  }
`

const SetupAddressPage: NextPage = () => {
  const [t] = useTranslation('settings')
  return (
    <PageContainer>
      <Navbar />
      <MainContainer>
        <Center position="relative" w="100%" mb="20px" mt="40px">
          <Heading>{t('setup.address.title')}</Heading>
          <Link href={RoutePath.SetupSignature} passHref prefetch>
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
      </MainContainer>
    </PageContainer>
  )
}

export default SetupAddressPage
