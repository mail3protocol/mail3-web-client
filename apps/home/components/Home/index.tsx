import { Flex } from '@chakra-ui/react'
import React, { useState } from 'react'
import { Navbar } from './navbar'
import { Dao } from './dao'
import { WhitelistGuide } from './whitelistGuide'
import { Footer } from './footer'
import { Entrance, EntranceStatus } from './entrance'
import { ScrollAnimation } from './scrollAnimation'

export const Home: React.FC = () => {
  const [status, setStatus] = useState<EntranceStatus>('opened')
  return (
    <Flex direction="column" position="relative">
      {status !== 'closed' ? <Entrance onChangeStatus={setStatus} /> : null}
      <Navbar />
      <ScrollAnimation />
      <Dao />
      <WhitelistGuide />
      <Footer />
    </Flex>
  )
}
