import React from 'react'
import type { NextPage, GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, ['settings', 'common'])),
  },
})

const SettingsAddress: NextPage = () => <div>Settings</div>

export default SettingsAddress
