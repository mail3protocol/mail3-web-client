import React from 'react'
import { Box } from '@chakra-ui/react'
import type { NextPage, GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { SentboxComponent } from '../components/Sentbox'

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, ['inbox'])),
  },
})

const Sentbox: NextPage = () => {
  console.log('Sentbox')

  return (
    <Box>
      <SentboxComponent />
    </Box>
  )
}

export default Sentbox
