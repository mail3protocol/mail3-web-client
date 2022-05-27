import type { GetServerSideProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { PageContainer } from 'ui'
import { Navbar } from '../components/Navbar'
import { LandingPage } from '../components/LandingPage'

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  res,
}) => {
  if (res) {
    res.writeHead(307, {
      Location: '/whitelist',
      'Cache-Control': 'no-cache, no-store',
      Pragma: 'no-cache',
    })
    res.end()
  }
  return {
    props: {
      ...(await serverSideTranslations(locale as string, ['common', 'home'])),
    },
  }
}

const Home: NextPage = () => (
  <PageContainer>
    <Navbar />
    <LandingPage />
  </PageContainer>
)

export default Home
