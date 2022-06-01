import { CONTAINER_MAX_WIDTH } from 'ui'
import {
  Box,
  BoxProps,
  Flex,
  FlexProps,
  Heading,
  Icon,
  Image,
  Text,
} from '@chakra-ui/react'
import React from 'react'
import styled from '@emotion/styled'
import Illustration2Png from '../../assets/png/illustration/2.png'
import Illustration3Svg from '../../assets/svg/illustration/3.svg'

export const LetterContentContainer = styled(Box)`
  font-size: 20px;

  h1 {
    font-size: 48px;
    margin-bottom: 114px;
    margin-top: 62px;
  }
  h2 {
    font-size: 28px;
    margin-bottom: 16px;
    margin-top: 60px;
  }
  p {
    margin-bottom: 0;
    line-height: 30px;
    font-weight: 300;
  }

  @media (max-width: 767px) {
    font-size: 13px;
    h1 {
      font-size: 24px;
      margin-bottom: 32px;
      margin-top: 32px;
    }
    h2 {
      font-size: 16px;
      margin-bottom: 8px;
      margin-top: 24px;
    }
    p {
      line-height: 20px;
    }
  }
`

export const LetterContent = () => (
  <>
    <Heading as="h1">What is Mail3?</Heading>
    <Heading as="h2">The web3 native communication protocol</Heading>
    <Text as="p">
      Traditional Email services are controlled by centralized companies.
    </Text>
    <Text as="p">
      We need a self-sovereign communication protocol to guarantee the
      anonymity, the content security, the privacy preservation, and the data
      persistance.
    </Text>
    <Heading as="h2">The blockchain agnostic DID network</Heading>
    <Text as="p">
      Mail3 adopts blockchain address and decentralized domain name as the mail
      alias.
    </Text>
    <Text as="p">
      Users connect with each other to form a global DID network and shape their
      decentralized reputation with onchain data.
    </Text>
    <Heading as="h2">The reaching out platform for crypto communities</Heading>
    <Text as="p">
      Mail3 supports community mail to reach out a group of users with specific
      crypto traits, such as holding the same NFT/POAPs, the same ERC20 tokens,
      or sharing the samilar DeFi activities.
    </Text>
    <Text as="p">
      Users would be glad to receive such mails since every community mail will
      attach some tokens as reading incentive.{' '}
    </Text>
    <Heading as="h2">The Lego base for productivity and SNS dApps</Heading>
    <Text>
      Mail3 users share their social connections, identities, and encryption
      exchange keys onchain so that any dApp could take adventage of these data
      to provide new services.
    </Text>
  </>
)

export const Letter: React.FC<
  {
    containerProps: BoxProps
  } & FlexProps
> = ({ containerProps, style, ...props }) => (
  <Flex
    direction="column"
    justify="center"
    align="center"
    w="100%"
    position="relative"
    zIndex={2}
    mx="auto"
    {...props}
    style={{
      ...style,
    }}
  >
    <LetterContentContainer
      maxW={`${CONTAINER_MAX_WIDTH - 90}px`}
      px={{
        base: '20px',
        md: '10%',
        lg: '140px',
      }}
      w={{ base: 'calc(100% - 40px)', md: 'calc(100% - 90px)' }}
      rounded={{ base: '24px', md: '40px' }}
      shadow="0 0 20px rgba(0, 0, 0, 0.15)"
      bg="#fff"
      position="relative"
      {...containerProps}
    >
      <Image
        src={Illustration2Png.src}
        position="absolute"
        top="0"
        right="0"
        w={{
          base: '126px',
          md: '20%',
        }}
        transform={{
          base: 'translate(-20px, 20px)',
          lg: 'translate(-66px, 49px)',
        }}
        zIndex={999}
      />
      <LetterContent />
      <Icon
        as={Illustration3Svg}
        w="20%"
        h="auto"
        position="absolute"
        bottom="0"
        right="25%"
        zIndex={99}
        transform="translateY(10%)"
      />
    </LetterContentContainer>
  </Flex>
)
