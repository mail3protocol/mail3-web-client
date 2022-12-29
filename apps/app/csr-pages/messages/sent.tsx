import React from 'react'
import { SentComponent } from '../../components/Sent'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useRedirectHome } from '../../hooks/useRedirectHome'

export const SentPage = () => {
  const { isAuth, redirectHome } = useRedirectHome()
  useDocumentTitle('Sent')
  if (!isAuth) {
    return redirectHome()
  }
  return <SentComponent />
}
