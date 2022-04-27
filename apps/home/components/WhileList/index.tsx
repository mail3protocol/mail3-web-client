import React from 'react'
import {
  Flex,
  Heading,
  Text,
  Icon,
  UnorderedList,
  Box,
  ListItem,
  Link,
  Center,
} from '@chakra-ui/react'
import LogoSvg from 'assets/svg/logo.svg'
import { Button, ConnectWallet } from 'ui'
import NextLink from 'next/link'
import { useAccount } from 'hooks'
import Mail3BackgroundSvg from 'assets/svg/mail3Background.svg'
import Head from 'next/head'
import { useTranslation } from 'next-i18next'
import { QualificationText } from './QualificationText'
import WhileListLogoSvg from '../../assets/svg/whileListLogo.svg'
import { Mascot } from './Mascot'
import { APP_URL } from '../../constants/env'

export const WhileList: React.FC = () => {
  const account = useAccount()
  const { t } = useTranslation('whilelist')
  const applicationPeriod = t('application_period', {
    date: '2022.6.1~2022.6.7',
  })
  const isQualified = false
  const mascotIndex = (() => {
    if (!account) return 1
    if (isQualified) return 2
    return 3
  })()
  return (
    <>
      <Head>
        <meta name="theme-color" content="#fff" />
      </Head>
      <Flex direction="column" align="center" minH="100vh">
        <Flex
          justify="space-between"
          h="60px"
          align="center"
          px={{
            base: '20px',
            md: '30px',
          }}
          w="full"
          maxW="1300px"
          transition="200ms"
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
              {t('whitelist')}
            </Heading>
            <NextLink href={APP_URL}>
              <Button shadow="0 4px 4px rgba(0, 0, 0, 0.25)">
                {t('launch-app')}
              </Button>
            </NextLink>
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
          flexDirection="column"
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
            w="full"
            mt={{
              base: '30px',
              md: '22px',
            }}
            pt={{
              base: '0',
              md: '56px',
            }}
            flex={{
              base: 1,
              md: 0,
            }}
            position="relative"
            transition="200ms"
            px="20px"
            minH="700px"
          >
            <Flex
              direction="column"
              justify="space-between"
              align="center"
              flex={1}
              maxH="567px"
              w="full"
            >
              <Flex direction="column" align="center" w="full">
                <Heading
                  fontSize={{
                    base: '24px',
                    md: '36px',
                  }}
                  mb="27px"
                  h="40px"
                  lineHeight="40px"
                >
                  {t('apply_for_beta_access_to')}
                </Heading>
                <Center position="relative" w="full">
                  <Icon
                    as={WhileListLogoSvg}
                    w={{
                      base: '183px',
                      md: '245px',
                    }}
                    h="auto"
                  />
                  <Icon
                    as={Mail3BackgroundSvg}
                    position="absolute"
                    left="50%"
                    top="0"
                    transform="translateX(-50%)"
                    w="calc(100% - 12px)"
                    maxW="955px"
                    h="auto"
                    zIndex="-2"
                  />
                </Center>
                {account ? (
                  <QualificationText isQualified={isQualified} />
                ) : (
                  <Text
                    w="full"
                    textAlign="center"
                    mt="40px"
                    whiteSpace="pre-line"
                  >
                    {applicationPeriod}
                  </Text>
                )}
              </Flex>
              <Box
                my="auto"
                shadow={
                  !account ? '0px 5px 10px rgba(0, 0, 0, 0.15)' : undefined
                }
                borderRadius="40px"
              >
                <ConnectWallet
                  renderConnected={(address) => (
                    <Button variant="outline">
                      {address.substring(0, 6)}…
                      {address.substring(address.length - 4)}
                    </Button>
                  )}
                />
              </Box>
              {!account ? (
                <Text
                  textAlign="center"
                  color="#333"
                  whiteSpace="pre-line"
                  fontWeight="light"
                >
                  {t(
                    'connect_wallet_to_see_if_you_are_eligible_to_join_the_whitelist'
                  )}
                </Text>
              ) : (
                <Text w="full" textAlign="center">
                  {applicationPeriod}
                </Text>
              )}
              <Box bg="#F3F3F3" px="62px" py="16px" rounded="24px" mt="auto">
                <UnorderedList
                  fontSize="12px"
                  lineHeight="20px"
                  fontWeight="medium"
                >
                  <ListItem>
                    {t('beta_period', {
                      date: '2022.6.7~2022.6.30',
                    })}
                  </ListItem>
                  <ListItem>
                    {t('eligibility')}
                    <NextLink href="/" passHref>
                      <Link color="#4E52F5">{t('details')}</Link>
                    </NextLink>
                  </ListItem>
                  <ListItem>{t('spots', { value: 5000 })}</ListItem>
                </UnorderedList>
              </Box>
            </Flex>
            <Flex
              position="relative"
              w="full"
              flex={{
                base: 1,
                md: 0,
              }}
              pt="20px"
              h={{
                base: 'auto',
                md: '56px',
              }}
              mt="auto"
            >
              <Mascot imageIndex={mascotIndex} />
            </Flex>
          </Flex>
        </Center>
      </Flex>
    </>
  )
}
