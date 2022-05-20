import React from 'react'
import type { NextPage, GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { PageContainer } from 'ui'
import { SentComponent } from '../../components/Sent'
import { Navbar } from '../../components/Navbar'

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, ['mailboxes'])),
  },
})

const Sent: NextPage = () => (
  <PageContainer>
    <Navbar />
    <SentComponent />
  </PageContainer>
)

export default Sent
