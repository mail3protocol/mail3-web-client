import React from 'react'
import type { NextPage, GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { PageContainer } from 'ui'
import { InboxComponent } from '../components/Inbox/index'
import { Navbar } from '../components/Navbar'

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, ['mailboxes'])),
  },
})

const Inbox: NextPage = () => (
  <>
    <PageContainer>
      <Navbar />
    </PageContainer>
    <InboxComponent />
  </>
)

export default Inbox
