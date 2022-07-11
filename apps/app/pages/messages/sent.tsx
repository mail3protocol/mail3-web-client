import React from 'react'
import { SentComponent } from '../../components/Sent'
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
      <SentComponent />
    </>
  )
}
