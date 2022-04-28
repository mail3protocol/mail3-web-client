import React, { useEffect, useState } from 'react'
import { Box, Center, Circle } from '@chakra-ui/react'
import { useDidMount } from 'hooks'
import { PageContainer } from 'ui'
import { Navbar } from '../Navbar'
import { useRouter } from 'next/router'

const mock_data = {}

export const PreviewComponent: React.FC = () => {
  const [data, setData] = useState(mock_data)
  const router = useRouter()
  const { id } = router.query

  useDidMount(() => {
    console.log('PreviewComponent useDidMount', id)
  })

  return <Box>test</Box>
}
