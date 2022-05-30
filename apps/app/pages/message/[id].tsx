import React from 'react'
import type { NextPage, GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { PageContainer } from 'ui'
import { PreviewComponent } from '../../components/Preview'
import { Navbar } from '../../components/Navbar'

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, ['common', 'preview'])),
  },
})

const Message: NextPage = () => (
  <PageContainer>
    <Navbar />
    <PreviewComponent />
  </PageContainer>
)

export default Message
