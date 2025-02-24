import { Flex, Alert, AlertIcon, Text } from '@chakra-ui/react'
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
    <Alert status="warning" textAlign="center" justifyContent="center">
      <AlertIcon />
      <Text>
        <b>
          Mail3 Shutdown Notice:Mail3 will stop maintenance in March 31!&nbsp;
        </b>
        Please back up your important data immediately to avoid any loss.
      </Text>
    </Alert>
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
