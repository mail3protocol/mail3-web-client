import { Box, Flex } from '@chakra-ui/react'
import React from 'react'
import { PageContainer } from 'ui'
import { GoToWriteMailButton } from '../../components/GoToWriteMailButton'
import { InboxNav } from '../../components/Inbox/Nav'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useRedirectHome } from '../../hooks/useRedirectHome'

export const SubPage = () => {
  const { isAuth, redirectHome } = useRedirectHome()
  useDocumentTitle('Subscription')
  if (!isAuth) {
    return redirectHome()
  }
  return (
    <Box pt={{ base: '25px', md: '35px' }}>
      <PageContainer>
        <Flex justify="space-between">
          <InboxNav initialScrollX={0} />
          <GoToWriteMailButton />
        </Flex>
      </PageContainer>
    </Box>
  )
}
