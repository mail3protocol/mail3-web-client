import React from 'react'
import { PageContainer } from 'ui'
import { SentComponent } from '../../components/Sent'
import { Navbar } from '../../components/Navbar'
import { useRedirectHome } from '../../hooks/useRedirectHome'

export const SentPage = () => {
  const { isAuth, redirectHome } = useRedirectHome()
  if (!isAuth) {
    return redirectHome()
  }
  return (
    <>
      {/* <Head>
        <title>Mail3: Sent</title>
      </Head> */}
      <PageContainer>
        <Navbar />
      </PageContainer>
      <SentComponent />
    </>
  )
}
