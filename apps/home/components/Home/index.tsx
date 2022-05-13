import { Flex } from '@chakra-ui/react'
import React from 'react'
import { Navbar } from './navbar'
import { RainbowBar } from './rainbowBar'
import { RollingSubtitles } from './rollingSubtitles'
import { isBetaTestingStage, isWhiteListStage } from '../../utils'
import { Letter } from './letter'
import { Dao } from './dao'
import { Ecosystem } from './ecosystem'
import { WhitelistGuide } from './whitelistGuide'
import { Footer } from './footer'
import { Banner } from './banner'
import { Entrance } from './entrance'

export const Home: React.FC = () => {
  const inWhiteListStage = isWhiteListStage()
  const isShowRainbowBar = inWhiteListStage || isBetaTestingStage()
  return (
    <Flex direction="column" position="relative">
      <Entrance />
      {isShowRainbowBar ? <RainbowBar /> : null}
      <Navbar />
      <Banner h={`calc(100vh${isShowRainbowBar ? '- 44px' : ''} - 60px)`} />
      <RollingSubtitles />
      <Letter />
      <Dao />
      <Ecosystem />
      {inWhiteListStage ? <WhitelistGuide /> : null}
      <Footer />
    </Flex>
  )
}
