import { useDidMount, useLoginAccount } from 'hooks'
import { GetServerSideProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import NextLink from 'next/link'
import React, { useMemo, useState } from 'react'
import ErrorPage from 'next/error'
import { useTranslation } from 'next-i18next'
import styled from '@emotion/styled'
import { Center, Flex, Button, Text } from '@chakra-ui/react'
import LogoSvg from 'assets/svg/logo.svg'
import { Avatar, LinkButton } from 'ui'
import { useRouter } from 'next/router'
import { isEthAddress } from '../utils/eth'
import { truncateMiddle } from '../utils/string'
import { MAIL_SERVER_URL } from '../constants/env'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { locale, resolvedUrl } = context
  const [address] = resolvedUrl.slice(1).split('?')
  const errorCode = isEthAddress(address) ? false : 404
  return {
    props: {
      errorCode,
      ...(await serverSideTranslations(locale as string, [
        'common',
        'navbar',
        'profile',
      ])),
    },
  }
}

const NavbarContainer = styled(Flex)`
  margin: 0 auto;
  max-width: 1220px;
  padding: 0 20px;
  position: relative;
  width: 100%;

  .nav {
    height: 60px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  @media (max-width: 600px) {
    .nav {
      justify-content: flex-start;
    }
  }
`

const Navbar: React.FC<{ address: string }> = ({ address }) => {
  const [t] = useTranslation('profile')
  const emailAddress = useMemo(
    () =>
      address
        ? `${truncateMiddle(
            `${address}`,
            6,
            4
          ).toLowerCase()}@${MAIL_SERVER_URL}`
        : '',
    [address]
  )
  const [isMounted, setIsMounted] = useState(false)
  useDidMount(() => {
    setIsMounted(true)
  })
  return (
    <NavbarContainer>
      <Flex className="nav">
        <NextLink href="/" passHref>
          <LinkButton>
            <LogoSvg />
          </LinkButton>
        </NextLink>
        {isMounted ? (
          <Flex alignItems="center" position="absolute" right="20px">
            {address ? (
              <Button
                as="a"
                target="_blank"
                href="https://app.mail3.me"
                variant="outline"
                borderRadius="40px"
                bg="transparent"
                borderColor="brand.500"
                minW="200px"
                _hover={{
                  bg: '#f5f5f5',
                }}
              >
                <Avatar w="32px" h="32px" address={address} />
                <Text ml="6px" fontSize="12px">
                  {emailAddress}
                </Text>
              </Button>
            ) : (
              <Button
                as="a"
                target="_blank"
                href="https://app.mail3.me"
                borderRadius="40px"
                bg="brand.500"
                w="200px"
                color="white"
                _hover={{
                  bg: 'brand.300',
                }}
              >
                {t('connect-wallet')}
              </Button>
            )}
          </Flex>
        ) : null}
      </Flex>
    </NavbarContainer>
  )
}

const btnBg = `linear-gradient(90.96deg, #898CFF 0.41%, #FFF500 29.76%, #FFA800 68.07%, #97F54E 100.92%)`

const ProfilePage: NextPage<{ errorCode: number }> = ({ errorCode }) => {
  const account = useLoginAccount()
  const router = useRouter()
  const [t] = useTranslation('profile')
  if (errorCode) {
    return <ErrorPage statusCode={errorCode} />
  }

  return (
    <Flex padding={0} flexDirection="column" position="relative">
      <Navbar address={account} />
      <iframe
        src={`https://app.cyberconnect.me/address/${router.query.id}`}
        title={`CyberConnect@${account}`}
        frameBorder="0"
        style={{
          overflow: 'hidden',
          height: 'calc(100vh - 60px)',
          width: '100%',
        }}
        height="calc(100vh - 60px)"
        width="100%"
      />
      <Center position="fixed" bottom="50px" w="100%">
        <Button
          color="white"
          bg={btnBg}
          _hover={{ bg: btnBg }}
          w="300px"
          borderRadius="40px"
          as="a"
          target="_blank"
          href={`https://app.mail3.me/message/new?to=${router.query.id}@${MAIL_SERVER_URL}`}
        >
          {t('mail-me')}
        </Button>
      </Center>
    </Flex>
  )
}

export default ProfilePage
