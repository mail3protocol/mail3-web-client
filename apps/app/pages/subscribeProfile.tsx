import { Box } from '@chakra-ui/react'
import { useParams } from 'react-router-dom'

export const SubscribeProfile = () => {
  const { id } = useParams()
  console.log('id', id)
  return <Box>{id}</Box>
}
