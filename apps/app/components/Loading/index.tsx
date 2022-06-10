import { Center } from '@chakra-ui/react'
import styled from '@emotion/styled'
import Image from 'next/image'
import React from 'react'

import GIFLoading from '../../assets/mailbox/loading.gif'

const LoadingBox = styled(Center)`
  width: 100%;
  height: 500px;
  align-items: center;
  justify-items: center;
`

export const Loading: React.FC = () => (
  <LoadingBox>
    <Image src={GIFLoading} />
  </LoadingBox>
)
