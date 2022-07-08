import { PageContainer } from 'ui'
import { useRedirectHome } from '../hooks/useRedirectHome'
import { Navbar } from '../components/Navbar'
import { LandingPage } from '../components/LandingPage'
import { InboxComponent } from '../components/Inbox'
import { DriftbottleBanner } from '../components/DriftbottleBanner'

export const HomePage = () => {
  const { redirectHome, isAuth } = useRedirectHome()

  if (!isAuth) {
    return redirectHome()
  }

  return (
    <>
      {/* <Head>
        <title>Mail3: {`${isAuth ? 'Inbox' : 'Home'}`}</title>
      </Head> */}
      <PageContainer>
        <Navbar />
        {!isAuth && <LandingPage />}
        <DriftbottleBanner />
      </PageContainer>
      {isAuth && <InboxComponent />}
    </>
  )
}
