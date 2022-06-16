import React from 'react'
import type { NextPage, GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { PageContainer } from 'ui'
import Head from 'next/head'
import { ProfileComponent } from '../../components/Profile'
import { Navbar } from '../../components/Navbar'
import { getAuthenticateProps } from '../../hooks/useLogin'

export const getServerSideProps: GetServerSideProps = getAuthenticateProps(
  async ({ locale }) => ({
    props: {
      ...(await serverSideTranslations(locale as string, [
        'common',
        'settings',
      ])),
    },
  })
)

const Message: NextPage = () => (
  <>
    <Head>
      <title>Mail3: Profile</title>
    </Head>
    <PageContainer>
      <Navbar />
      <ProfileComponent />
    </PageContainer>
  </>
)

export default Message
