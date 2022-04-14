import type { GetServerSideProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { ConnectWallet } from '../components/ConnectWallet'
import styles from '../styles/Home.module.css'

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, ['connect'])),
  },
})

const Home: NextPage = () => (
  <div className={styles.container}>
    <ConnectWallet />
  </div>
)

export default Home
