import React from 'react'
import type { NextPage, GetServerSideProps } from 'next'
import { Center, Link, Icon } from '@chakra-ui/react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { PageContainer } from 'ui'
import LogoSvg from 'assets/svg/logo-pure.svg'
import { WhiteList } from '../components/Whitelist'
import { HOME_URL, NAVBAR_HEIGHT } from '../constants'

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, [
      'whitelist',
      'common',
    ])),
  },
})

const Navbar = () => (
  <Center h={`${NAVBAR_HEIGHT}px`}>
    <Link isExternal href={HOME_URL}>
      <Icon as={LogoSvg} w="124px" h="auto" />
    </Link>
  </Center>
)

const WhiteListPage: NextPage = () => (
  <PageContainer>
    <Navbar />
    <WhiteList />
  </PageContainer>
)

export default WhiteListPage
