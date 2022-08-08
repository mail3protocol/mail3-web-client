import React from 'react'
import { SpamComponent } from '../../components/Spam'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useRedirectHome } from '../../hooks/useRedirectHome'

export const SpamPage = () => {
  const { isAuth, redirectHome } = useRedirectHome()
  useDocumentTitle('Spam')
  if (!isAuth) {
    return redirectHome()
  }
  return <SpamComponent />
}
