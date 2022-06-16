import { Box, Center, HStack, Text } from '@chakra-ui/react'
import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Avatar, Button } from 'ui'
import { MAIL_SERVER_URL } from '../../constants'

import SvgMailme from '../../assets/profile/mail-me.svg'
import SvgCopy from '../../assets/profile/copy.svg'
import SvgShare from '../../assets/profile/share.svg'
import SvgTwitter from '../../assets/profile/twitter.svg'
import SvgMore from '../../assets/profile/more.svg'

import SvgEtherscan from '../../assets/profile/business/etherscan.svg'
import SvgArrow from '../../assets/profile/business/arrow.svg'
// import SvgCheer from '../../assets/profile/business/cheer.svg'
// import SvgLens from '../../assets/profile/business/lens.svg'
// import SvgTree from '../../assets/profile/business/tree.svg'

enum ButtonType {
  Copy,
  Share,
  Twitter,
}

const buttonConfig: Record<
  ButtonType,
  {
    Icon: any
    hoverText: string
  }
> = {
  [ButtonType.Copy]: {
    Icon: SvgCopy,
    hoverText: 'Share profile card',
  },
  [ButtonType.Share]: {
    Icon: SvgShare,
    hoverText: 'Share profile card',
  },
  [ButtonType.Twitter]: {
    Icon: SvgTwitter,
    hoverText: 'Share profile card',
  },
}

const Container = styled(Box)`
  position: relative;
  max-width: 475px;
  margin: 120px auto;
  padding: 60px 20px 55px 20px;
  background-color: #ffffff;
  box-shadow: 0px 0px 10px 4px rgba(25, 25, 100, 0.1);
  border-radius: 24px;

  .avatar {
    top: -40px;
    left: 50%;
    transform: translateX(-50%);
    position: absolute;
    border: 4px solid #fff;
    border-radius: 50%;
  }

  .button-list {
    top: 5px;
    right: 15px;
    position: absolute;

    .button-wrap-mobile {
      display: none;
    }
  }

  .address {
    background: #f3f3f3;
    border-radius: 16px;
    padding: 13px;
    text-align: center;

    .p {
      font-style: normal;
      font-weight: 600;
      font-size: 24px;
      line-height: 28px;
    }
  }

  @media (max-width: 600px) {
    .button-list {
      .button-wrap-mobile {
        display: block;
      }
      .button-wrap-pc {
        display: none;
      }
    }
  }
`

export const ProfileComponent: React.FC = () => {
  const [t] = useTranslation('common')

  const router = useRouter()
  const { id } = router.query as {
    id: string
  }

  const actionMap = {
    [ButtonType.Copy]: () => {},
    [ButtonType.Twitter]: () => {},
    [ButtonType.Share]: () => {},
  }

  const address = `${id}@${MAIL_SERVER_URL}`

  return (
    <>
      <Container>
        <Box className="avatar">
          <Avatar
            address="0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d"
            w="72px"
            h="72px"
          />
        </Box>
        <Box className="button-list">
          <Box className="button-wrap-mobile">
            <Box
              as="button"
              onClick={() => {
                // show pop
                console.log('show pop')
              }}
              p="10px"
            >
              <SvgMore />
            </Box>
          </Box>
          <HStack className="button-wrap-pc">
            {[ButtonType.Twitter, ButtonType.Copy, ButtonType.Share].map(
              (type: ButtonType, index) => {
                const { Icon, hoverText } = buttonConfig[type]
                const onClick = actionMap[type]
                return (
                  <Box
                    as="button"
                    // eslint-disable-next-line react/no-array-index-key
                    key={index}
                    p="10px"
                    onClick={() => {
                      if (onClick) onClick()
                      console.log(hoverText)
                    }}
                  >
                    <Icon />
                  </Box>
                )
              }
            )}
          </HStack>
        </Box>
        <Box className="address">
          <Text className="p">{address}</Text>
        </Box>
        <Center mt="25px">
          <HStack spacing="24px">
            {[SvgArrow, SvgEtherscan].map((Item, index) => (
              <Box
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                w={{ base: '24px', md: '36px' }}
                h={{ base: '24px', md: '36px' }}
              >
                <Item />
              </Box>
            ))}
          </HStack>
        </Center>
      </Container>

      <Center>
        <Button>
          <SvgMailme /> Mail me
        </Button>
      </Center>
    </>
  )
}
