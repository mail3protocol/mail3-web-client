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
      {status !== 'closed' ? (
        <Entrance
          onChangeStatus={(s) => {
            window.scroll(0, 0)
            setStatus(s)
          }}
        />
      ) : null}
      <Navbar />
      <ScrollAnimation
        style={{ opacity: status === 'closing' || status === 'closed' ? 1 : 0 }}
      />
      <Dao />
      <WhitelistGuide />
      <Footer />
    </Flex>
  )
}
