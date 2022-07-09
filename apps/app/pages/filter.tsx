import React from 'react'
import type { NextPage, GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { PageContainer } from 'ui'
import styled from '@emotion/styled'
import { Box } from '@chakra-ui/react'
import Head from 'next/head'
import { Navbar } from '../components/Navbar'
import { getAuthenticateProps } from '../hooks/useLogin'
import DidFilter from '../components/Didfilter'

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

const Filter: NextPage = () => (
  <>
    <Head>
      <title>Mail3: DiD Filter</title>
    </Head>
    <PageContainer>
      <Navbar />
    </PageContainer>
    <NewPageContainer>
      <Box paddingTop={{ base: '25px', md: '35px' }}>
        <DidFilter />
      </Box>
    </NewPageContainer>
  </>
)

export default Filter
