import React from 'react'
import { Box } from '@chakra-ui/react'
import type { NextPage, GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { InboxComponent } from '../components/Inbox/index'

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, ['inbox'])),
  },
})

const Inbox: NextPage = () => {
  console.log('inbox')

  return (
    <Box>
      <InboxComponent />
    </Box>
  )
}

export default Inbox
