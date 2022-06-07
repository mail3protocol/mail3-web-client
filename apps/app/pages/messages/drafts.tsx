import React from 'react'
import type { NextPage, GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { PageContainer } from 'ui'
import { DraftsComponent } from '../../components/Drafts'
import { Navbar } from '../../components/Navbar'

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, [
      'common',
      'mailboxes',
    ])),
  },
})

const Drafts: NextPage = () => (
  <>
    <PageContainer>
      <Navbar />
    </PageContainer>
    <DraftsComponent />
  </>
)

export default Drafts
