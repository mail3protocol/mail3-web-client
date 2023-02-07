import React from 'react'
import { PageContainer } from 'ui'
import { PreviewComponent } from '../../components/Preview'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useRedirectHome } from '../../hooks/useRedirectHome'

export const MessagePage = () => {
  const { isAuth, redirectHome } = useRedirectHome()
  useDocumentTitle('Read Mail')
  if (!isAuth) {
    return redirectHome()
  }
  return (
    <PageContainer>
      <PreviewComponent />
    </PageContainer>
  )
}
