import React from 'react'
import type { NextPage, GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { PageContainer } from 'ui'
import { TrashComponent } from '../../components/Trash'
import { Navbar } from '../../components/Navbar'

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, [
      'common',
      'mailboxes',
    ])),
  },
})

const Trash: NextPage = () => (
  <PageContainer>
    <Navbar />
    <TrashComponent />
  </PageContainer>
)

export default Trash
