import { Box, Flex, Heading, Icon, Text, Image } from '@chakra-ui/react'
import { CONTAINER_MAX_WIDTH } from 'ui'
import React from 'react'
import { useInnerSize } from 'hooks'
import styled from '@emotion/styled'
import EnvelopeBgSvg from '../../assets/svg/envelope-bg.svg'
import EnvelopeBottomCoverSvg from '../../assets/svg/envelope-bottom-cover.svg'
import Illustration2Png from '../../assets/png/illustration/2.png'
import Illustration4Png from '../../assets/png/illustration/4.png'
import Illustration5Png from '../../assets/png/illustration/5.png'
import Illustration6Png from '../../assets/png/illustration/6.png'
import Illustration7Png from '../../assets/png/illustration/7.png'

export const LetterContentContainer = styled(Box)`
  font-size: 20px;

  h1 {
    font-size: 48px;
    margin-bottom: 62px;
    margin-top: 54px;
  }
  h2 {
    font-size: 28px;
    margin-bottom: 16px;
    margin-top: 32px;
  }
  p {
    margin-bottom: 8px;
  }

  @media (max-width: 767px) {
    font-size: 14px;
    h1 {
      font-size: 24px;
      margin-bottom: 32px;
      margin-top: 32px;
    }
    h2 {
      font-size: 18px;
      margin-bottom: 8px;
      margin-top: 24px;
    }
  }
`

const LetterContent = () => (
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

export const Letter: React.FC = () => {
  const envelopePaddingX = 60
  const { width } = useInnerSize()
  return (
    <Flex
      w="full"
      h="auto"
      position="relative"
      maxW={`${CONTAINER_MAX_WIDTH}px`}
      mx="auto"
      direction="column"
      align="center"
      pt={{
        base: '48px',
        lg: '64px',
      }}
      pb={{
        base: '48px',
        lg: '64px',
      }}
      minH="calc(100vh - 44px - 60px)"
    >
      <Flex
        direction="column"
        position="absolute"
        top="16px"
        left={{
          base: 0,
          lg: `${envelopePaddingX}px`,
        }}
        w={{
          base: 'full',
          lg: `calc(100% - ${envelopePaddingX * 2}px)`,
        }}
        h={{ base: '100%', md: 'calc(100% - 64px)' }}
        pb={{ base: '5%', md: '3%' }}
      >
        <Icon
          as={EnvelopeBgSvg}
          w="full"
          h="auto"
          overflow="hidden"
          position="relative"
        />
        <Box
          w="full"
          h="full"
          mt="-10px"
          mx="auto"
          position="relative"
          bg="#e7e7e7"
          borderBottomRadius="20px"
        />
      </Flex>
      <LetterContentContainer
        bg="#fff"
        w={{
          base: 'calc(100% - 40px)',
          lg: `calc(100% - 90px - ${envelopePaddingX * 2}px)`,
        }}
        h="auto"
        shadow="0 0 20px rgba(0, 0, 0, 0.15)"
        rounded="24px"
        position="relative"
        mx="auto"
        flex={1}
        style={{
          minHeight: `${Math.min(width, CONTAINER_MAX_WIDTH)}px`,
        }}
        transition="200ms"
        display="flex"
        flexDirection="column"
      >
        <Box
          px={{
            base: '20px',
            md: '10%',
            lg: '140px',
          }}
          mb="auto"
        >
          <LetterContent />
        </Box>
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
        />
        <Flex
          overflow="hidden"
          position="relative"
          w={{ base: 'calc(100% + 40px)', lg: 'calc(100% + 90px)' }}
          left={{ base: '-20px', lg: '-45px' }}
          h="auto"
          transform={{ base: 'translateY(48px)', lg: 'translateY(2%)' }}
          mt="-10%"
        >
          <Icon
            as={EnvelopeBottomCoverSvg}
            w="full"
            h="auto"
            mt="auto"
            transform="scale(1.035)"
          />
          <Image
            src={Illustration4Png.src}
            w="20%"
            h="auto"
            position="absolute"
            top="40%"
            right="5%"
            transform="rotate(31deg)"
          />
          <Image
            src={Illustration5Png.src}
            w="30%"
            h="auto"
            position="absolute"
            bottom="5%"
            left="0"
          />
          <Image
            src={Illustration6Png.src}
            w="25%"
            h="auto"
            position="absolute"
            bottom="5%"
            left="50%"
          />
          <Image
            src={Illustration7Png.src}
            w="30%"
            h="auto"
            position="absolute"
            top="25%"
            left="0"
          />
        </Flex>
      </LetterContentContainer>
    </Flex>
  )
}
