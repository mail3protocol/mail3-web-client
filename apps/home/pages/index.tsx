import type { GetServerSideProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import React from 'react'
import { Home } from '../components/Home'

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, [
      'connect',
      'common',
      'index',
    ])),
  },
})

const HomePage: NextPage = () => <Home />

export default HomePage
