import React, { useEffect, useRef, useState } from 'react'
import { PageContainer } from 'ui'
import styled from '@emotion/styled'
import { Box, Flex } from '@chakra-ui/react'
import { Navbar } from '../components/Navbar'
import { MailboxContainer } from '../components/Inbox'
import { InboxNav } from '../components/Inbox/Nav'
import { SubscriptionBody } from '../components/SubscriptionBody'
import { GoToWriteMailButton } from '../components/GoToWriteMailButton'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

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

export const SubscriptionPage = () => {
  useDocumentTitle('Subscription')
  return (
    <>
      {/* <Head>
        <title>Mail3: Subscription</title>
      </Head> */}
      <Sticky>
        <PageContainer>
          <Navbar />
        </PageContainer>
      </Sticky>
      <NewPageContainer>
        <Box paddingTop={{ base: '25px', md: '35px' }}>
          <Flex justify="space-between" pl="20px">
            <InboxNav />
            <GoToWriteMailButton />
          </Flex>

          <MailboxContainer minH="700px">
            <Box padding={{ base: '20px 30px 60px', md: '40px 64px' }}>
              <SubscriptionBody />
            </Box>
          </MailboxContainer>
        </Box>
      </NewPageContainer>
    </>
  )
}
