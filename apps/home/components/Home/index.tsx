import { Flex } from '@chakra-ui/react'
import React, { useState } from 'react'
import { Navbar } from './navbar'
import { RainbowBar } from './rainbowBar'
import { isBetaTestingStage, isWhiteListStage } from '../../utils'
import { Dao } from './dao'
import { Ecosystem } from './ecosystem'
import { WhitelistGuide } from './whitelistGuide'
import { Footer } from './footer'
import { Banner } from './banner'
import { Entrance, EntranceStatus } from './entrance'
import { ScrollAnimation } from './scrollAnimation'

export const Home: React.FC = () => {
  const inWhiteListStage = isWhiteListStage()
  const isShowRainbowBar = inWhiteListStage || isBetaTestingStage()
  const [status, setStatus] = useState<EntranceStatus>('opened')
  return (
    <Flex direction="column" position="relative">
      {status !== 'closed' ? <Entrance onChangeStatus={setStatus} /> : null}
      {isShowRainbowBar ? <RainbowBar /> : null}
      <Navbar />
      <ScrollAnimation>
        <Banner />
      </ScrollAnimation>
      <Dao />
      <Ecosystem />
      {inWhiteListStage ? <WhitelistGuide /> : null}
      <Footer />
    </Flex>
  )
}
