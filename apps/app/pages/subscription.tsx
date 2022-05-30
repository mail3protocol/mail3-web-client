import React from 'react'
import type { NextPage, GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Button, PageContainer } from 'ui'
import styled from '@emotion/styled'
import { Box } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { Navbar } from '../components/Navbar'
import { FlexButtonBox, MailboxContainer } from '../components/Inbox'
import { InboxNav, InboxNavType } from '../components/Inbox/Nav'
import { RoutePath } from '../route/path'
import { SubscriptionBody } from '../components/SubscriptionBody'
import SVGWrite from '../assets/mailbox/write.svg'

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, ['subscription'])),
  },
})

const NewPageContainer = styled(PageContainer)`
  @media (max-width: 600px) {
    padding: 0;
  }
`

const Subscription: NextPage = () => {
  const router = useRouter()

  return (
    <>
      <PageContainer>
        <Navbar />
      </PageContainer>
      <NewPageContainer>
        <Box paddingTop={{ base: '25px', md: '35px' }}>
          <FlexButtonBox>
            <InboxNav currentType={InboxNavType.Subscription} />
            <Button
              className="btn-write"
              onClick={() => {
                router.push(RoutePath.NewMessage)
              }}
            >
              <SVGWrite /> <Box ml="10px">Write</Box>
            </Button>
          </FlexButtonBox>

          <MailboxContainer minH="700px">
            <Box padding="40px 64px">
              <SubscriptionBody />
            </Box>
          </MailboxContainer>
        </Box>
      </NewPageContainer>
    </>
  )
}

export default Subscription
