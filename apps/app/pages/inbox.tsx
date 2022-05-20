import React from 'react'
import type { NextPage, GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { PageContainer } from 'ui'
import styled from '@emotion/styled'
import { InboxComponent } from '../components/Inbox/index'
import { Navbar } from '../components/Navbar'

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, ['mailboxes'])),
  },
})

const NewPageContainer = styled(PageContainer)`
  @media (max-width: 600px) {
    padding: 0;
  }
`

const Inbox: NextPage = () => (
  <NewPageContainer>
    <Navbar />
    <InboxComponent />
  </NewPageContainer>
)

export default Inbox
