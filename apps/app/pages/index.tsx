import type { GetServerSideProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { PageContainer } from 'ui'
import Head from 'next/head'
import { Navbar } from '../components/Navbar'
import { LandingPage } from '../components/LandingPage'
import { parseCookies, useIsAuthenticated } from '../hooks/useLogin'
import { InboxComponent } from '../components/Inbox'

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  res,
  req,
}) => {
  if (res && !!process.env.REDIRECT_HOME) {
    const cookie = parseCookies(req)
    if (typeof cookie?.jwt !== 'string') {
      res.writeHead(307, {
        Location: '/testing',
        'Cache-Control': 'no-cache, no-store',
        Pragma: 'no-cache',
      })
      res.end()
    }
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
