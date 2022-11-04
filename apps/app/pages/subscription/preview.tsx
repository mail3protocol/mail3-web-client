import { Box } from '@chakra-ui/react'
import styled from '@emotion/styled'
import React from 'react'
import { PageContainer } from 'ui'
import { GotoSubscription } from '../../components/GotoSubscription'
import { NewPageContainer } from '../../components/Inbox'

import { SubPreview } from '../../components/Subscription'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useRedirectHome } from '../../hooks/useRedirectHome'

const Container = styled(PageContainer)`
  margin: 25px auto 150px;
  background-color: #ffffff;
  box-shadow: 0px 0px 10px 4px rgba(25, 25, 100, 0.1);
  border-radius: 24px;
  padding: 40px 60px;

  @media (max-width: 600px) {
    border-radius: 0;
    box-shadow: none;
    padding: 0px;
    margin: 10px auto 50px;
  }
`

export const SubPreviewPage = () => {
  const { isAuth, redirectHome } = useRedirectHome()
  useDocumentTitle('Subscription')
  if (!isAuth) {
    return redirectHome()
  }
  return (
    <Box pt={{ base: '25px', md: '35px' }}>
      <NewPageContainer>
        <GotoSubscription />
      </NewPageContainer>
      <Container>
        <SubPreview isSingleMode />
      </Container>
    </Box>
  )
}
