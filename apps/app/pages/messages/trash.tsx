import React from 'react'
import type { NextPage, GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { PageContainer } from 'ui'
import { TrashComponent } from '../../components/Trash'
import { Navbar } from '../../components/Navbar'
import { PreviewComponent } from '../../components/Preview'

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, ['connect'])),
  },
})

const Trash: NextPage = () => {
  console.log('Trash')

  return (
    <PageContainer>
      <Navbar />
      <TrashComponent />
    </PageContainer>
  )
}

export default Trash
