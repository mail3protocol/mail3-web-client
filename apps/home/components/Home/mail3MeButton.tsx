import React from 'react'
import '@mail3/mail3-me'
import { Box } from '@chakra-ui/react'

const Mail3MeButton: React.FC = () => (
  <Box transform="translateX(-10%)">
    <mail3-me to="mail3.eth@mail3.me" variant="outline" css="color: #fff" />
  </Box>
)

export default Mail3MeButton
