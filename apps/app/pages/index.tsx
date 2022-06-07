import type { GetServerSideProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { PageContainer } from 'ui'
import Head from 'next/head'
import { Navbar } from '../components/Navbar'
import { LandingPage } from '../components/LandingPage'
import { InboxComponent } from '../components/Inbox'
import { useIsAuthenticated } from '../hooks/useLogin'

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  res,
}) => {
  if (res && !!process.env.REDIRECT_HOME) {
    res.writeHead(307, {
      Location: '/whitelist',
      'Cache-Control': 'no-cache, no-store',
      Pragma: 'no-cache',
    })
    res.end()
  }
  return {
    props: {
      ...(await serverSideTranslations(locale as string, [
        'common',
        'home',
        'mailboxes',
      ])),
    },
  }
}

const Home: NextPage = () => {
  const isAuth = useIsAuthenticated()

  return (
    <>
      <Head>
        <title>Mail3: Home</title>
      </Head>
      <PageContainer>
        <Navbar />
        {!isAuth && <LandingPage />}
      </PageContainer>
      {isAuth && <InboxComponent />}
    </>
  )
}

export default Home
