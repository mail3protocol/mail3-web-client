import React from 'react'
import type { NextPage, GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Box } from '@chakra-ui/react'
import { DraftsComponent } from '../../components/Drafts'

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, ['connect'])),
  },
})

const Drafts: NextPage = () => {
  console.log('Drafts')

  return (
    <Box>
      <DraftsComponent />
    </Box>
  )
}

export default Drafts
