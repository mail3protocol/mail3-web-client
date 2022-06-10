import type { GetServerSideProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { PageContainer } from 'ui'
import Head from 'next/head'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { Navbar } from '../components/Navbar'
import { LandingPage } from '../components/LandingPage'
import { parseCookies, useIsAuthenticated } from '../hooks/useLogin'
import { InboxComponent } from '../components/Inbox'
import { RoutePath } from '../route/path'

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  res,
  req,
}) => {
  let isAuth = false
  if (res) {
    const cookie = parseCookies(req)
    if (typeof cookie?.jwt !== 'string') {
      res.writeHead(307, {
        Location: '/testing',
        'Cache-Control': 'no-cache, no-store',
        Pragma: 'no-cache',
      })
      res.end()
    } else {
      isAuth = true
    }
  }
  return {
    props: {
      isAuth,
      ...(await serverSideTranslations(locale as string, [
        'common',
        'home',
        'mailboxes',
      ])),
    },
  }
}

const Home: NextPage<{ isAuth: boolean }> = ({ isAuth }) => {
  const isAuthenticated = useIsAuthenticated()
  const router = useRouter()
  useEffect(() => {
    if (!isAuthenticated) {
      router.push(RoutePath.Testing)
    }
  }, [isAuthenticated])

  return (
    <>
      <Head>
        <title>Mail3: {`${isAuth ? 'Inbox' : 'Home'}`}</title>
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
