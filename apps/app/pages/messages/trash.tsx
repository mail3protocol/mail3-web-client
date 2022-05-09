import React from 'react'
import type { NextPage, GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { TrashComponent } from '../../components/Trash'

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, ['connect'])),
  },
})

const Trash: NextPage = () => {
  console.log('Trash')

  return <TrashComponent />
}

export default Trash
