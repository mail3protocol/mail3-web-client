import React from 'react'
import { TrashComponent } from '../../components/Trash'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useRedirectHome } from '../../hooks/useRedirectHome'

export const TrashPage = () => {
  const { isAuth, redirectHome } = useRedirectHome()
  useDocumentTitle('Trash')
  if (!isAuth) {
    return redirectHome()
  }
  return <TrashComponent />
}
