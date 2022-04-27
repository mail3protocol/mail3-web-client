import type { GetServerSideProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { PageContainer } from 'ui'
import { Navbar } from '../components/Navbar'
import { LandingPage } from '../components/LandingPage'

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, ['common', 'home'])),
  },
})

const Home: NextPage = () => (
  <PageContainer>
    <Navbar />
    <LandingPage />
  </PageContainer>
)

export default Home
