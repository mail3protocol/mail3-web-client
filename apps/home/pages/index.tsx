import type { GetServerSideProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, ['connect'])),
  },
})

const Home: NextPage = () => (
  <div>
    <h1>Email.me</h1>
  </div>
)

export default Home
