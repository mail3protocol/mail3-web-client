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
    right: 50px;
  }

  @media (max-width: 600px) {
    width: auto;
    left: 0;
    height: calc(100% - 10px);
    max-width: 100%;
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
    height: calc(100% - 20px);
    bottom: 10px;
    right: 10px;
    max-width: calc(100% - 20px);
    margin-bottom: 0;
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
  @media (max-width: 950px) {
    width: 15%;
    right: 50px;
  }

  @media (max-width: 600px) {
    width: auto;
    height: calc(100% - 40px);
    bottom: 10px;
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
