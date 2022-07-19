import { Flex } from '@chakra-ui/react'
import React, { useState } from 'react'
import { Navbar } from './navbar'
import { Dao } from './dao'
import { WhitelistGuide } from './whitelistGuide'
import { Footer } from './footer'
import { Entrance, EntranceStatus } from './entrance'
import { ScrollAnimation } from './scrollAnimation'
import { RollingSubtitles } from './rollingSubtitles'
import { Developers } from './developers'

export const Home: React.FC = () => {
  const [status, setStatus] = useState<EntranceStatus>('opened')
  return (
    <Flex direction="column" position="relative" bg="#F3F3F3">
      {status !== 'closed' ? (
        <Entrance
          onChangeStatus={(s) => {
            setStatus(s)
          }}
        />
      ) : null}
      <Navbar />
      <ScrollAnimation />
      <RollingSubtitles />
      <Dao />
      <Developers />
      <WhitelistGuide />
      <Footer />
    </Flex>
  )
}
