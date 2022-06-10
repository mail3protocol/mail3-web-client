import React from 'react'
import type { NextPage, GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { PageContainer } from 'ui'
import Head from 'next/head'
import { SentComponent } from '../../components/Sent'
import { Navbar } from '../../components/Navbar'
import { getAuthenticateProps } from '../../hooks/useLogin'

export const getServerSideProps: GetServerSideProps = getAuthenticateProps(
  async ({ locale }) => ({
    props: {
      ...(await serverSideTranslations(locale as string, [
        'common',
        'mailboxes',
      ])),
    },
  })
)

const Sent: NextPage = () => (
  <>
    <Head>
      <title>Mail3: Sent</title>
    </Head>
    <PageContainer>
      <Navbar />
    </PageContainer>
    <SentComponent />
  </>
)

export default Sent
