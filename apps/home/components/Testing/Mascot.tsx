import React from 'react'
import styled from '@emotion/styled'
import Mascot1Svg from '../../assets/svg/mascot/1.svg'
import Mascot2Svg from '../../assets/svg/mascot/2.svg'
import Mascot3Svg from '../../assets/svg/mascot/3.svg'

const Mascot1 = styled(Mascot1Svg)`
  width: 100%;
  height: auto;
  max-height: 100%;
  margin-top: auto;
`

const Mascot2 = styled(Mascot2Svg)`
  width: 100%;
  height: auto;
  max-height: 100%;
  padding-bottom: 10px;
  margin-top: auto;
`

const Mascot3 = styled(Mascot3Svg)`
  width: 100%;
  height: auto;
  max-height: 100%;
  padding-bottom: 10px;
  margin-top: auto;
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
