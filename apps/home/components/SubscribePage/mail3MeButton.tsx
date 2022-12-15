import { Box } from '@chakra-ui/react'
import '@mail3/mail3-me'
import React from 'react'

const Mail3MeButton: React.FC<{ to: string }> = ({ to }) => (
  <Box
    display="inline-block"
    ml="10px"
    verticalAlign="middle"
    id="screenshot-ignore-element"
  >
    <mail3-me to={to} lite />
  </Box>
)

export default Mail3MeButton
