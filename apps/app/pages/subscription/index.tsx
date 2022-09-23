import { Box, Flex } from '@chakra-ui/react'
import styled from '@emotion/styled'
import React from 'react'
import { PageContainer } from 'ui'
import { GoToWriteMailButton } from '../../components/GoToWriteMailButton'
import { InboxNav } from '../../components/Inbox/Nav'
import { SubWrap } from '../../components/Subscription'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useRedirectHome } from '../../hooks/useRedirectHome'

const FlexNav = styled(Flex)`
  @media (max-width: 768px) {
    .write-button {
      display: none;
    }
  }
`

export const SubPage = () => {
  const { isAuth, redirectHome } = useRedirectHome()
  useDocumentTitle('Subscription')
  if (!isAuth) {
    return redirectHome()
  }
  return (
    <Box pt={{ base: '25px', md: '35px' }}>
      <PageContainer>
        <FlexNav justify="space-between">
          <InboxNav initialScrollX={0} />
          <GoToWriteMailButton className="write-button" />
        </FlexNav>

        <SubWrap />
      </PageContainer>
    </Box>
  )
}
