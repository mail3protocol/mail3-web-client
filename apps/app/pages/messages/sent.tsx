import React from 'react'
import type { NextPage, GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Box } from '@chakra-ui/react'
import { SentComponent } from '../../components/Sent'

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, ['connect'])),
  },
})

const Sent: NextPage = () => {
  console.log('Sentbox')

  return (
    <Box>
      <SentComponent />
    </Box>
  )
}

export default Sent
