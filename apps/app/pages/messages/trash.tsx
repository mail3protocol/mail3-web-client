import React from 'react'
import { PageContainer } from 'ui'
import { TrashComponent } from '../../components/Trash'
import { Navbar } from '../../components/Navbar'
import { useRedirectHome } from '../../hooks/useRedirectHome'

export const TrashPage = () => {
  const { isAuth, redirectHome } = useRedirectHome()
  if (!isAuth) {
    return redirectHome()
  }
  return (
    <>
      {/* <Head>
        <title>Mail3: Trash</title>
      </Head> */}
      <PageContainer>
        <Navbar />
      </PageContainer>
      <TrashComponent />
    </>
  )
}
