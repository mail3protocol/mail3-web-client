import React from 'react'
import type { NextPage, GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { PageContainer } from 'ui'
import Head from 'next/head'
import { PreviewComponent } from '../../components/Preview'
import { Navbar } from '../../components/Navbar'
import { getAuthenticateProps } from '../../hooks/useLogin'

export const getServerSideProps: GetServerSideProps = getAuthenticateProps(
  async ({ locale }) => ({
    props: {
      ...(await serverSideTranslations(locale as string, [
        'common',
        'mailboxes',
        'preview',
      ])),
    },
  })
)

const Message: NextPage = () => (
  <>
    <Head>
      <title>Mail3: Edit Mail</title>
    </Head>
    <PageContainer>
      <Navbar />
      <PreviewComponent />
    </PageContainer>
  </>
)

export default Message
