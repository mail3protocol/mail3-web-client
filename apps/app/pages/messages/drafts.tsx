import React from 'react'
import { DraftsComponent } from '../../components/Drafts'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useRedirectHome } from '../../hooks/useRedirectHome'

export const DraftsPage = () => {
  const { isAuth, redirectHome } = useRedirectHome()
  useDocumentTitle('Drafts')
  if (!isAuth) {
    return redirectHome()
  }
  return <DraftsComponent />
}
