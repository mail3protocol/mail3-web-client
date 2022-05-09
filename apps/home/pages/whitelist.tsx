import { GetServerSideProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import React from 'react'
import { WhiteList } from '../components/WhiteList'

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, [
      'connect',
      'common',
      'whilelist',
      'navbar',
    ])),
  },
})

const WhiteListPage: NextPage = () => <WhiteList />

export default WhiteListPage
