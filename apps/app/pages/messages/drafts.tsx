import React from 'react'
import { PageContainer } from 'ui'
import { DraftsComponent } from '../../components/Drafts'
import { Navbar } from '../../components/Navbar'
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
      <PageContainer>
        <Navbar />
      </PageContainer>
      <DraftsComponent />
    </>
  )
}
