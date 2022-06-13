import React from 'react'
import type { NextPage, GetServerSideProps } from 'next'
import { Center, Link, Icon } from '@chakra-ui/react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { PageContainer } from 'ui'
import LogoSvg from 'assets/svg/logo-pure.svg'
import Head from 'next/head'
import { HOME_URL, NAVBAR_HEIGHT } from '../constants'
import { Testing } from '../components/Testing'

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, ['testing', 'common'])),
  },
})

const Navbar = () => (
  <Center h={`${NAVBAR_HEIGHT}px`}>
    <Link isExternal href={HOME_URL}>
      <Icon as={LogoSvg} w="124px" h="auto" />
    </Link>
  </Center>
)

const TestingPage: NextPage = () => (
  <>
    <Head>
      <title>Mail3: Beta</title>
    </Head>
    <PageContainer>
      <Navbar />
      <Testing />
    </PageContainer>
  </>
)

export default TestingPage
