import type { GetServerSideProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { PageContainer } from 'ui'
import Head from 'next/head'
import { LoginInfo, useDidMount } from 'hooks'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { Navbar } from '../components/Navbar'
import { LandingPage } from '../components/LandingPage'
import { parseCookies, useIsAuthenticated } from '../hooks/useLogin'
import { InboxComponent } from '../components/Inbox'
import { RoutePath } from '../route/path'
import { useSetLoginInfo } from '../hooks/useLoginInfo'
import { getUtmQueryString } from '../utils'
import { DriftbottleBanner } from '../components/DriftbottleBanner'

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  res,
  req,
  query,
}) => {
  let isAuth = false
  let loginInfo: LoginInfo | null = null
  if (res) {
    const cookie = parseCookies(req)
    if (typeof cookie?.jwt !== 'string') {
      res.writeHead(307, {
        Location: `/testing${getUtmQueryString(query)}`,
        'Cache-Control': 'no-cache, no-store',
        Pragma: 'no-cache',
      })
      res.end()
    } else {
      isAuth = true
      loginInfo = {
        address: cookie.address,
        uuid: cookie.uuid,
        jwt: cookie.jwt,
      }
    }
  }
  return {
    props: {
      loginInfo,
      isAuth,
      ...(await serverSideTranslations(locale as string, [
        'common',
        'home',
        'mailboxes',
      ])),
    },
  }
}

const Home: NextPage<{ isAuth: boolean; loginInfo: LoginInfo }> = ({
  isAuth,
  loginInfo,
}) => {
  const isAuthenticated = useIsAuthenticated()
  const router = useRouter()
  const setLoginInfo = useSetLoginInfo()
  useEffect(() => {
    if (!isAuthenticated) {
      router.push(RoutePath.Testing)
    }
  }, [isAuthenticated])

  useDidMount(() => {
    if (loginInfo) {
      setLoginInfo(loginInfo)
    }
  })

  return (
    <>
      <Head>
        <title>Mail3: {`${isAuth ? 'Inbox' : 'Home'}`}</title>
      </Head>
      <PageContainer>
        <Navbar />
        {!isAuth && <LandingPage />}
        <DriftbottleBanner />
      </PageContainer>
      {isAuth && <InboxComponent />}
    </>
  )
}

export default Home
