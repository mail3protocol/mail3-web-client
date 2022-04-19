import type { GetServerSideProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Navbar } from '../components/Navbar'

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, ['connect', 'common'])),
  },
})

const Home: NextPage = () => (
  <div>
    <Navbar />
  </div>
)

export default Home
