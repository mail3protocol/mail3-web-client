import React from 'react'
import type { NextPage, GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { PageContainer } from 'ui'
import styled from '@emotion/styled'
import { Box } from '@chakra-ui/react'
import Head from 'next/head'
import { Navbar } from '../components/Navbar'
import { MailboxContainer } from '../components/Inbox'
import { getAuthenticateProps } from '../hooks/useLogin'

export const getServerSideProps: GetServerSideProps = getAuthenticateProps(
  async ({ locale }) => ({
    props: {
      ...(await serverSideTranslations(locale as string, ['common', 'filter'])),
    },
  })
)

const NewPageContainer = styled(PageContainer)`
  @media (max-width: 600px) {
    padding: 0;
  }
`

const Subscription: NextPage = () => (
  <>
    <Head>
      <title>Mail3: DiD Filter</title>
    </Head>
    <PageContainer>
      <Navbar />
    </PageContainer>
    <NewPageContainer>
      <Box paddingTop={{ base: '25px', md: '35px' }}>
        <MailboxContainer minH="700px">
          <Box padding={{ base: '20px 30px 60px', md: '40px 64px' }}>
            did filter
          </Box>
        </MailboxContainer>
      </Box>
    </NewPageContainer>
  </>
)

export default Subscription
