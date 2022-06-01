import React, { useEffect, useRef, useState } from 'react'
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
    ...(await serverSideTranslations(locale as string, [
      'common',
      'subscription',
    ])),
  },
})

const NewPageContainer = styled(PageContainer)`
  @media (max-width: 600px) {
    padding: 0;
  }
`

const StickyWrap = styled(Box)`
  width: 100%;
  background-color: #fff;
  top: -1px;
  position: sticky;
  z-index: 9;
`

interface StickyProps {
  children: any
}
const Sticky: React.FC<StickyProps> = ({ children }) => {
  const refWrap = useRef(null)
  const [isShadow, setIsShadow] = useState(false)

  useEffect(() => {
    if (refWrap.current) {
      const observer = new IntersectionObserver(
        ([e]) => {
          const isSticky = e.intersectionRatio < 1
          setIsShadow(isSticky)
        },
        { threshold: [1] }
      )
      observer.observe(refWrap.current)

      return () => {
        if (refWrap.current) {
          observer.unobserve(refWrap.current)
        }
      }
    }

    return () => {}
  }, [refWrap.current])

  return (
    <StickyWrap
      ref={refWrap}
      style={{
        boxShadow: isShadow ? '0px 0px 10px 4px rgb(25 25 100 / 10%)' : 'none',
      }}
    >
      {children}
    </StickyWrap>
  )
}

const Subscription: NextPage = () => {
  const router = useRouter()

  return (
    <>
      <Sticky>
        <PageContainer>
          <Navbar />
        </PageContainer>
      </Sticky>
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
