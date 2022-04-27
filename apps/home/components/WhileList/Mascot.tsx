import React from 'react'
import styled from '@emotion/styled'
import Mascot1Svg from '../../assets/svg/mascot/1.svg'
import Mascot2Svg from '../../assets/svg/mascot/2.svg'
import Mascot3Svg from '../../assets/svg/mascot/3.svg'

const Mascot1 = styled(Mascot1Svg)`
  position: absolute;
  bottom: 0;
  left: 100px;
  width: 20%;
  height: auto;
  max-width: 190px;
  transition: 200ms;
  @media (max-width: 950px) {
    width: 15%;
    left: 50px;
  }

  @media (max-width: 600px) {
    width: auto;
    height: 10vh;
    position: sticky;
    left: 0;
    margin-top: auto;
    margin-right: auto;
    bottom: 0;
  }
`

const Mascot2 = styled(Mascot2Svg)`
  position: absolute;
  bottom: 0;
  right: 100px;
  width: 20%;
  height: auto;
  max-width: 190px;
  transition: 200ms;
  margin-bottom: 10px;
  @media (max-width: 950px) {
    width: 15%;
    right: 50px;
  }

  @media (max-width: 600px) {
    width: auto;
    height: 10vh;
    position: sticky;
    margin-top: auto;
    margin-left: auto;
    bottom: 10px;
  }
`

const Mascot3 = styled(Mascot3Svg)`
  position: absolute;
  bottom: 0;
  right: 100px;
  width: 20%;
  height: auto;
  max-width: 190px;
  transition: 200ms;
  margin-bottom: 10px;
  @media (max-width: 950px) {
    width: 15%;
    right: 50px;
  }

  @media (max-width: 600px) {
    width: auto;
    height: 10vh;
    position: sticky;
    margin-top: auto;
    margin-left: auto;
    bottom: 0;
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
