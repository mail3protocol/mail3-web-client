import React from 'react'
import type { NextPage, GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { PageContainer } from 'ui'
import Head from 'next/head'
import { TrashComponent } from '../../components/Trash'
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

const Trash: NextPage = () => (
  <>
    <Head>
      <title>Mail3: Trash</title>
    </Head>
    <PageContainer>
      <Navbar />
    </PageContainer>
    <TrashComponent />
  </>
)

export default Trash
