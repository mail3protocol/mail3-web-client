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
  useMediaQuery,
  Center,
} from '@chakra-ui/react'
import type { GetServerSideProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import LogoSvg from 'assets/svg/logo.svg'
import { Button, theme } from 'ui'
import Link from 'next/link'
import Mail3BackgroundSvg from 'assets/svg/mail3Background.svg'
import WhileListLogoSvg from '../assets/svg/whileListLogo.svg'

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, ['connect', 'common'])),
  },
})

const WhileList: NextPage = () => {
  const [isMobile] = useMediaQuery('(max-width: 600px)')
  console.log(theme)
  console.log({ isMobile })
  return (
    <Flex direction="column" align="center">
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
          {!isMobile ? (
            <Heading fontSize="28px" mr="22px" h="40px" lineHeight="40px">
              Whitelist
            </Heading>
          ) : null}
          <Button>Launch App</Button>
        </Flex>
      </Flex>
      <Center px={isMobile ? undefined : '30px'} w="full" transition="200ms">
        <Flex
          direction="column"
          align="center"
          shadow={isMobile ? undefined : '0 0 10px 4px rgba(25, 25, 100, 0.1)'}
          rounded="24px"
          maxW="1220px"
          w="full"
          mt={isMobile ? '30px' : '22px'}
          pt={isMobile ? undefined : '56px'}
          pb="56px"
          position="relative"
          transition="200ms"
        >
          <Heading
            fontSize={isMobile ? '24px' : '36px'}
            mb="27px"
            h="40px"
            lineHeight="40px"
          >
            Apply for beta access to
          </Heading>
          <Icon as={WhileListLogoSvg} w="auto" h="auto" />
          <Icon
            as={Mail3BackgroundSvg}
            position="absolute"
            top="120px"
            left="50%"
            transform="translateX(-50%)"
            w="calc(100% - 12px)"
            maxW="955px"
            h="auto"
          />
          <Text w="full" textAlign="center" mt="40px">
            Applicaition Period: 2022.6.1~2022.6.7
          </Text>
          <Button mt="40px">Connect Wallet</Button>
          <Text textAlign="center" mt="16px" color="#333">
            Connect wallet to see <br />
            if you are eligible to join the whitelist
          </Text>
          <Box bg="#F3F3F3" px="62px" py="16px" rounded="24px" mt="96px">
            <UnorderedList fontSize="12px" lineHeight="20px">
              <ListItem>Beta Period: 2022.6.7~2022.6.30</ListItem>
              <ListItem>
                Eligiblity:{' '}
                <Link href="/">
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

export default WhileList
