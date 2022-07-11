import React from 'react'
import { DraftsComponent } from '../../components/Drafts'
import { useRedirectHome } from '../../hooks/useRedirectHome'

export const DraftsPage = () => {
  const { isAuth, redirectHome } = useRedirectHome()
  if (!isAuth) {
    return redirectHome()
  }
  return (
    <>
      {/* <Head>
        <title>Mail3: Drafts</title>
      </Head> */}
      <DraftsComponent />
    </>
  )
}
