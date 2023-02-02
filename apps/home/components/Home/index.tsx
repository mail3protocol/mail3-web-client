import { Flex } from '@chakra-ui/react'
import React from 'react'
import { Navbar } from './navbar'
import { Dao } from './dao'
import { WhitelistGuide } from './whitelistGuide'
import { Footer } from './footer'
import { ScrollAnimation } from './scrollAnimation'
import { RollingSubtitles } from './rollingSubtitles'
import { Developers } from './developers'
import { BrandWall } from './BrandWall'

export const Home: React.FC = () => (
  <Flex direction="column" position="relative" bg="#F3F3F3">
    <Navbar />
    <ScrollAnimation />
    <RollingSubtitles />
    <Dao />
    <Developers />
    <BrandWall />
    <WhitelistGuide />
    <Footer />
  </Flex>
)
