import React from 'react'
import type { NextPage, GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { PageContainer } from 'ui'
import Head from 'next/head'
import { DraftsComponent } from '../../components/Drafts'
import { Navbar } from '../../components/Navbar'
import { getAuthenticateProps } from '../../hooks/useLogin'
import { GotoInbox } from '../../components/GotoInbox'

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

const Drafts: NextPage = () => (
  <>
    <Head>
      <title>Mail3: Drafts</title>
    </Head>
    <PageContainer>
      <Navbar />
    </PageContainer>
    <DraftsComponent />
  </>
)

export default Drafts
