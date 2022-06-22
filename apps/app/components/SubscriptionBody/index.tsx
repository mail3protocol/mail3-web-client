import React, { useState } from 'react'
import { Avatar, Box, Center, Text, Wrap, WrapItem } from '@chakra-ui/react'
import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { Button } from 'ui'
import {
  MediaSubscriptionsItem,
  TrackEvent,
  TrackKey,
  useDidMount,
  useTrackClick,
} from 'hooks'
import SubTop from '../../assets/subscription/top.png'
import SVGBell from '../../assets/subscription/bell.svg'
import SVGBellCur from '../../assets/subscription/bell-cur.svg'

import Mail3 from '../../assets/subscription/logo/Mail3.png'
import Bankless from '../../assets/subscription/logo/Bankless.png'
import TheDefiant from '../../assets/subscription/logo/TheDefiant.png'
import WeekinEthereumNews from '../../assets/subscription/logo/WeekinEthereumNews.png'
import MirrorCuratorDAO from '../../assets/subscription/logo/MirrorCuratorDAO.png'
import ArthurHayes from '../../assets/subscription/logo/ArthurHayes.png'
import CryptoJobsList from '../../assets/subscription/logo/CryptoJobsList.png'
import Web3Jobs from '../../assets/subscription/logo/Web3Jobs.png'

const imgs = [
  Mail3,
  Bankless,
  TheDefiant,
  WeekinEthereumNews,
  MirrorCuratorDAO,
  ArthurHayes,
  CryptoJobsList,
  Web3Jobs,
]

const dataMD = `
| n | name | url | class | desc |
| 1 | Mail3 | / | 项目方动态 | All about Mail3! |
| 2 | Bankless | https://newsletter.banklesshq.com/ | 综合 | The ultimate guide to DeFi, NFTs, Ethereum, and Bitcoin.  |
| 3 | The Defiant  | https://newsletter.thedefiant.io/ | / | Curate, digest, and analyze all the major developments in DeFi |
| 4 | Week in Ethereum News | https://weekinethereumnews.com/ | / | Ethereum News and Links |
| 5 | Mirror Curator DAO | https://mcdao.mirror.xyz/ | 项目方动态更新 | Find the best writers, articles and projects on Mirror |
| 6 | Arthur Hayes | https://cryptohayes.medium.com/ | 投资长文 | Co-Founder of 100x. Trading and crypto enthusiast. Focused on helping spread financial literacy and educate investors. |
| 7 | CryptoJobsList | https://cryptojobslist.com/newsletter | web3 job | The Web’s Biggest List of Cryptocurrency Jobs, Web3 Jobs and Blockchain Jobs |
| 8 | Web3 Jobs | https://web3.career/ | web3 job | Blockchain, Solidity and Crypto Jobs |
`

function textToObj(str: string) {
  const data = str
    .split('\n')
    .filter((e: string) => e.trim().length > 0)
    .map((e) =>
      e
        .trim()
        .split('|')
        .filter((_e) => _e.trim().length > 0)
        .map((_e) => _e.trim())
    )

  const ret = data.slice(1).map((item) => {
    const obj: any = {}
    data[0].forEach((key, index) => {
      obj[key] = item[index]
    })
    return obj
  })

  return ret
}

const realData = textToObj(dataMD)

interface ListItem {
  name: string
  desc: string
  avatarSrc: any
  isNew: boolean
  isSub: boolean
}

type HandleClick = (index: number, type: string) => void

interface ItemProps extends ListItem {
  index: number
  handleClick: HandleClick
}

const Item = (props: ItemProps) => {
  const { name, avatarSrc, desc, isSub, isNew, index, handleClick } = props

  let _button = (
    <Button
      w="100px"
      onClick={() => {
        handleClick(index, 'follow')
      }}
    >
      <SVGBell />
    </Button>
  )

  if (isSub) {
    _button = (
      <Button
        w="100px"
        bg="transparent"
        border="1px solid #6F6F6F"
        boxShadow="none"
        color="#6F6F6F"
        onClick={() => {
          handleClick(index, 'unfollow')
        }}
        _hover={{
          bg: '#f2f2f2',
        }}
        leftIcon={<SVGBellCur />}
      >
        Cancel
      </Button>
    )
  }

  return (
    <>
      {isNew && (
        <Box position="absolute" top="-2px" left="-7px">
          <Center w="75px" h="29px" bg={`url(${SubTop.src})`}>
            News
          </Center>
        </Box>
      )}
      <Avatar src={avatarSrc.src} />
      <Box>
        <Center>
          <Box marginLeft="5px" fontWeight="700" fontSize="18px">
            {name}
          </Box>
        </Center>
      </Box>
      <Box
        maxWidth="220px"
        fontWeight="400"
        fontSize="12px"
        lineHeight="16px"
        height="64px"
        textAlign="center"
      >
        <Text noOfLines={4}>{desc}</Text>
      </Box>
      {_button}
    </>
  )
}

const data = realData.map((e, i) => ({
  ...e,
  isNew: false,
  isSub: false,
  avatarSrc: imgs[i],
}))

const dataAtom = atomWithStorage<Array<ListItem>>('subscriptionData', data)

export const SubscriptionBody: React.FC = () => {
  const trackBell = useTrackClick(TrackEvent.ClickSubscriptionBell)
  const trackMedia = useTrackClick(TrackEvent.MediaSubscriptions)
  const [list, setList] = useAtom(dataAtom)
  const [isShow, setIsShow] = useState(false)

  useDidMount(() => {
    setIsShow(true)
  })

  const handleClick: HandleClick = (index, type) => {
    const newList = [...list]
    trackBell()

    if (type === 'follow') {
      trackMedia({
        [TrackKey.MediaSubscriptions]: MediaSubscriptionsItem[index],
      })
      // doing follow
      newList[index].isSub = true
    } else {
      // doing unfollow
      newList[index].isSub = false
    }
    setList(newList)
  }

  return (
    <Box color="#000">
      <Box lineHeight="30px" textAlign={{ base: 'left', md: 'center' }}>
        <Box fontWeight="700" fontSize={{ base: '16px', md: '28px' }}>
          Coming soon
        </Box>
        <Box fontWeight="300" fontSize={{ base: '14px', md: '20px' }}>
          Subscribe to your favorite authors and you&apos;ll receive a curated
          email when they update their content.
        </Box>
      </Box>

      {isShow ? (
        <Box marginTop="20px">
          <Wrap spacing="20px" justify="center">
            {list.map((item, index) => (
              <WrapItem
                key={item.name}
                w="259px"
                h="266px"
                bg="#FFFFFF"
                boxShadow="0px 0px 6px 2px rgba(198, 198, 198, 0.2)"
                borderRadius="12px"
                flexDirection="column"
                alignItems="center"
                justifyContent="space-evenly"
                position="relative"
              >
                <Item {...item} index={index} handleClick={handleClick} />
              </WrapItem>
            ))}
          </Wrap>
        </Box>
      ) : null}
    </Box>
  )
}
