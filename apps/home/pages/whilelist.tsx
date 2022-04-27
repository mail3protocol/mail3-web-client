import { GetServerSideProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import React from 'react'
import { WhileList } from '../components/WhileList'

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, [
      'connect',
      'common',
      'whilelist',
    ])),
  },
})

const WhileListPage: NextPage = () => <WhileList />

export default WhileListPage
