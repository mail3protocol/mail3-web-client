import { GetServerSideProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import React from 'react'
import { Testing } from '../components/Testing'
import { TESTING_DATE_RANGE } from '../constants/env'

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  if (new Date().getTime() < TESTING_DATE_RANGE[0].getTime()) {
    return {
      redirect: {
        destination: '/whitelist',
        permanent: false,
      },
    }
  }

  return {
    props: {
      ...(await serverSideTranslations(locale as string, [
        'connect',
        'common',
        'navbar',
        'testing',
      ])),
    },
  }
}

const TestingPage: NextPage = () => <Testing />

export default TestingPage
