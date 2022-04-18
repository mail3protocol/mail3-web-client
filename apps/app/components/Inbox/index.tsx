import { useTranslation } from 'next-i18next'
import React from 'react'
import { Box } from '@chakra-ui/react'
import { useDidMount } from '../../hooks/useDidMount'

export const InboxComponent: React.FC = () => {
  const [t] = useTranslation('inbox')

  useDidMount(() => {
    console.log('useDidMount')
  })

  return <Box>{t('title')}</Box>
}
