import React, { useMemo } from 'react'
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
import { Button, ConnectWallet } from 'ui'
import NextLink from 'next/link'
import { useAccount } from 'hooks'
import Mail3BackgroundSvg from 'assets/svg/mail3Background.svg'
import Head from 'next/head'
import { useTranslation } from 'next-i18next'
import { QualificationText } from './QualificationText'
import WhileListLogoSvg from '../../assets/svg/whileListLogo.svg'
import { Mascot } from './Mascot'
import { Navbar } from '../Navbar'
import { Container } from '../Container'
import { getDateRangeFormat } from '../../utils/whitelist'
import {
  APPLICATION_PERIOD_DATE_RANGE,
  BETA_TESTING_DATE_RANGE,
} from '../../constants/env'

export const WhiteList: React.FC = () => {
  const account = useAccount()
  const { t } = useTranslation('whilelist')
  const applicationPeriod = t('application_period', {
    date: getDateRangeFormat(APPLICATION_PERIOD_DATE_RANGE),
  })
  const isQualified = false
  const mascotIndex = useMemo(() => {
    if (!account) return 1
    if (isQualified) return 2
    return 3
  }, [account, isQualified])
  return (
    <>
      <Head>
        <meta name="theme-color" content="#fff" />
      </Head>
      <Flex direction="column" align="center" minH="100vh">
        <Navbar headingText={t('whitelist')} />
        <Container
          h="calc(100% - 60px)"
          w={{
            base: 'full',
            md: 'calc(100% - 80px)',
          }}
        >
          <Flex
            direction="column"
            justify="space-between"
            align="center"
            flexShrink={0}
            flex={1}
            h="567px"
            maxH={{
              base: '500px',
              md: 'unset',
            }}
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
              <Box
                lineHeight="30px"
                fontSize="20px"
                mt={{
                  base: '20px',
                  md: '40px',
                }}
                textAlign="center"
                position="relative"
                whiteSpace="pre-line"
                fontWeight="medium"
              >
                {account ? (
                  <QualificationText isQualified={isQualified} />
                ) : (
                  <Text fontWeight="normal">{applicationPeriod}</Text>
                )}
              </Box>
            </Flex>
            <Box
              my="auto"
              shadow={!account ? '0px 5px 10px rgba(0, 0, 0, 0.15)' : undefined}
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
              <Text
                w="full"
                textAlign="center"
                my="auto"
                fontSize={{
                  base: '14px',
                  md: '20px',
                }}
              >
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
                    date: getDateRangeFormat(BETA_TESTING_DATE_RANGE),
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
            position="sticky"
            w="full"
            h={{
              base: 'calc(100% - 500px)',
              md: '36px',
            }}
            transition="200ms"
            flex={1}
            bottom="0"
          >
            <Mascot imageIndex={mascotIndex} />
          </Flex>
        </Container>
      </Flex>
    </>
  )
}
