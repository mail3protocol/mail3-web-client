import React from 'react'
import styled from '@emotion/styled'
import { Box } from '@chakra-ui/react'
import Mascot1Svg from '../../assets/mascot/1.svg'
import Mascot2Svg from '../../assets/mascot/2.svg'
import Mascot3Svg from '../../assets/mascot/3.svg'

const Mascot1 = styled(Mascot1Svg)`
  position: absolute;
  bottom: 0;
  left: 5%;
  width: 20%;
  height: auto;
  max-width: 190px;
  transition: 200ms;
  padding-top: 10px;
  @media (max-width: 767px) {
    position: relative;
    width: 80px;
    left: 0;
    right: 0;
    height: 110px;
  }
`

const Mascot2 = styled(Mascot2Svg)`
  position: absolute;
  bottom: 0;
  right: 5%;
  width: 20%;
  height: auto;
  max-width: 190px;
  transition: 200ms;
  margin-bottom: 10px;
  padding: 10px 0;
  @media (max-width: 767px) {
    position: relative;
    width: 165px;
    height: 66px;
    left: 0;
    right: 0;
    margin-bottom: 0;
  }
`

const Mascot3 = styled(Mascot3Svg)`
  position: absolute;
  bottom: 0;
  right: 5%;
  width: 20%;
  height: auto;
  max-width: 190px;
  transition: 200ms;
  padding: 10px 0;
  @media (max-width: 767px) {
    position: relative;
    width: 90px;
    height: 116px;
    left: 0;
    right: 0;
  }
`

export const Mascot: React.FC<{
  imageIndex?: 1 | 2 | 3
}> = ({ imageIndex = 1 }) => {
  const imageMap = {
    1: <Mascot1 />,
    2: <Mascot2 />,
    3: <Mascot3 />,
  }
  return imageMap[imageIndex]
}

export const MascotSvg: React.FC<{
  imageIndex?: 1 | 2 | 3
}> = ({ imageIndex = 1 }) => {
  const imageMap = {
    1: (
      <Box w="98px" mt="48px">
        <Mascot1Svg />
      </Box>
    ),
    2: (
      <Box w="194px" mt="40px">
        <Mascot2Svg />
      </Box>
    ),
    3: (
      <Box w="107px" mt="48px">
        <Mascot3Svg />
      </Box>
    ),
  }
  return imageMap[imageIndex]
}
