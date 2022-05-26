import type { GetServerSideProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { PageContainer } from 'ui'
import { Navbar } from '../components/Navbar'
import { LandingPage } from '../components/LandingPage'
import { InboxComponent } from '../components/Inbox'
import { useIsAuthenticated } from '../hooks/useLogin'

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, [
      'common',
      'home',
      'mailboxes',
    ])),
  },
})

const Home: NextPage = () => {
  const isAuth = useIsAuthenticated()

  return (
    <>
      <PageContainer>
        <Navbar />
        {!isAuth && <LandingPage />}
      </PageContainer>
      {isAuth && <InboxComponent />}
    </>
  )
}

export default Home
