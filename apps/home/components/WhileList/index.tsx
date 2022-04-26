import React from 'react'
import {
  Flex,
  Heading,
  Text,
  Icon,
  UnorderedList,
  Box,
  ListItem,
  Link as CharkaLink,
  Center,
} from '@chakra-ui/react'
import LogoSvg from 'assets/svg/logo.svg'
import { Button, ConnectWallet } from 'ui'
import Link from 'next/link'
import { useAccount } from 'hooks'
import Mail3BackgroundSvg from 'assets/svg/mail3Background.svg'
import { QualificationText } from './QualificationText'
import WhileListLogoSvg from '../../assets/svg/whileListLogo.svg'

export const WhileList: React.FC = () => {
  const account = useAccount()
  const applicaitionPeriod = 'Applicaition Period: 2022.6.1~2022.6.7'
  return (
    <Flex direction="column" align="center" minH="100vh">
      <Flex
        justify="space-between"
        h="60px"
        align="center"
        px="30px"
        w="full"
        maxW="1300px"
      >
        <LogoSvg />
        <Flex>
          <Heading
            fontSize="28px"
            mr="22px"
            h="40px"
            lineHeight="40px"
            display={{
              base: 'none',
              md: 'block',
            }}
          >
            Whitelist
          </Heading>
          <Button>Launch App</Button>
        </Flex>
      </Flex>
      <Center
        px={{
          base: '0',
          md: '30px',
        }}
        w="full"
        flex={{
          base: 1,
          md: 0,
        }}
        transition="200ms"
      >
        <Flex
          direction="column"
          align="center"
          shadow={{
            base: 'none',
            md: '0 0 10px 4px rgba(25, 25, 100, 0.1)',
          }}
          rounded="24px"
          maxW="1220px"
          minH="700px"
          w="full"
          mt={{
            base: '30px',
            md: '22px',
          }}
          pt={{
            base: '0',
            md: '56px',
          }}
          pb="56px"
          position="relative"
          transition="200ms"
          px="20px"
        >
          <Icon
            as={Mail3BackgroundSvg}
            position="absolute"
            top="120px"
            left="50%"
            transform="translateX(-50%)"
            w="calc(100% - 12px)"
            maxW="955px"
            h="auto"
            zIndex="-2"
          />
          <Heading
            fontSize={{
              base: '24px',
              md: '36px',
            }}
            mb="27px"
            h="40px"
            lineHeight="40px"
          >
            Apply for beta access to
          </Heading>
          <Icon as={WhileListLogoSvg} w="auto" h="auto" />
          {account ? (
            <QualificationText isQualified />
          ) : (
            <Text w="full" textAlign="center" mt="40px" h="150px">
              {applicaitionPeriod}
            </Text>
          )}
          <ConnectWallet
            renderConnected={(address) => (
              <Button variant="outline">
                {address.substring(0, 6)}…
                {address.substring(address.length - 4)}
              </Button>
            )}
          />
          {!account ? (
            <Text textAlign="center" pt="16px" pb="96px" color="#333" h="156px">
              Connect wallet to see <br />
              if you are eligible to join the whitelist
            </Text>
          ) : (
            <Text w="full" textAlign="center" pt="112px" h="156px">
              {applicaitionPeriod}
            </Text>
          )}
          <Box bg="#F3F3F3" px="62px" py="16px" rounded="24px">
            <UnorderedList fontSize="12px" lineHeight="20px">
              <ListItem>Beta Period: 2022.6.7~2022.6.30</ListItem>
              <ListItem>
                Eligiblity:{' '}
                <Link href="/" passHref>
                  <CharkaLink color="#4E52F5">Details {'>>'}</CharkaLink>
                </Link>
              </ListItem>
              <ListItem>Spots: 5000</ListItem>
            </UnorderedList>
          </Box>
        </Flex>
      </Center>
    </Flex>
  )
}
