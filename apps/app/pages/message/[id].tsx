import React from 'react'
import { PageContainer } from 'ui'
import { PreviewComponent } from '../../components/Preview'
import { Navbar } from '../../components/Navbar'
import { useRedirectHome } from '../../hooks/useRedirectHome'

export const MessagePage = () => {
  const { isAuth, redirectHome } = useRedirectHome()
  if (!isAuth) {
    return redirectHome()
  }
  return (
    <>
      {/* <Head>
        <title>Mail3: Read Mail</title>
      </Head> */}
      <PageContainer>
        <Navbar />
        <PreviewComponent />
      </PageContainer>
    </>
  )
}
