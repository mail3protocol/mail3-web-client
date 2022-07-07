import React from 'react'
import type { NextPage, GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { PageContainer } from 'ui'
import styled from '@emotion/styled'
import { Box, Center } from '@chakra-ui/react'
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

export const ContentWrap = styled(Box)`
  margin: 20px auto;
  background-color: #ffffff;
  box-shadow: 0px 0px 10px 4px rgba(25, 25, 100, 0.1);
  border-radius: 24px;

  .wrap {
    max-width: 848px;
    margin: 0 auto;
    text-align: center;
  }

  .h2 {
    font-weight: 700;
    font-size: 16px;
    margin-top: 24px;
    span {
      background: radial-gradient(
        100% 100% at 80% 50%,
        #de1af075 0%,
        rgba(46, 255, 205, 1) 100%
      );
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  .rules-area {
    margin-top: 6px;
    min-height: 80px;
    padding: 16px;
    background: #f3f3f3;
    border: 1px solid #e7e7e7;
    border-radius: 16px;
    align-items: baseline;
    justify-content: flex-start;
    flex-wrap: wrap;

    .rule {
      margin-top: 10px;
      border-radius: 39px;
      padding: 7px 10px;
      font-weight: 700;
      font-size: 12px;
      line-height: 18px;

      color: #000000;
    }

    .rule-green {
      background: #95ffbc;
    }

    .rule-purple {
      background: #d8dbff;
    }

    .condition {
      font-weight: 700;
      font-size: 12px;
      padding: 0 10px;
    }
  }

  @media (max-width: 600px) {
    margin-top: 0px;
    border-top-right-radius: 0;
    border-top-left-radius: 0;
    box-shadow: none;

    .h2 {
      margin-top: 16px;
      font-size: 14px;
    }

    .rules-area {
      width: 335px;
      margin: 6px auto;
    }
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
        <ContentWrap minH="700px">
          <Box className="wrap">
            <Box pt={{ base: '20px', md: '20px' }}>
              <Box fontSize={{ base: '20px', md: '28px' }} fontWeight="700">
                DID Filter
              </Box>
              <Box className="h2">
                Use <span>Web3 DID</span> to filter senders automaticly
              </Box>
              <Box fontSize="14px">Get emails from who...</Box>
            </Box>
            <Center className="rules-area">
              <Center color="#6F6F6F" width="100%" height="70px">
                No smart filtering logic is currently set
              </Center>

              {/* <Box className="rule rule-green">
                【NFT】Chain：Ethereum；NFT：HAHAHAHA；
              </Box>
              <Box className="condition">ro</Box>
              <Box className="rule rule-purple">
                【ERC20】Chain：Ethereum；Token：HALO；Amount 》1000
              </Box>
              <Box className="condition">ro</Box>
              <Box className="rule rule-purple">
                【ERC20】Chain：Ethereum；Token：HALO；Amount 》1000
              </Box>
              <Box className="condition">ro</Box>
              <Box className="rule rule-purple">
                【ERC20】Chain：Ethereum；Token：HALO；Amount 》1000
              </Box>
              <Box className="condition">ro</Box>
              <Box className="rule rule-purple">
                【ERC20】Chain：Ethereum；Token：HALO；Amount 》1000
              </Box> */}
            </Center>
          </Box>
        </ContentWrap>
      </Box>
    </NewPageContainer>
  </>
)

export default Subscription
