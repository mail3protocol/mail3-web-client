import React from 'react'
import { TrashComponent } from '../../components/Trash'
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
      <TrashComponent />
    </>
  )
}
