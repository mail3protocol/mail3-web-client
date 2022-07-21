import { useDidMount, useLoginAccount } from 'hooks'
import { GetServerSideProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import NextLink from 'next/link'
import React, { useMemo, useState } from 'react'
import ErrorPage from 'next/error'
import styled from '@emotion/styled'
import { Flex, Button, Text } from '@chakra-ui/react'
import { Avatar, LinkButton, Logo } from 'ui'
import { useRouter } from 'next/router'
import { isEthAddress, truncateMiddle } from 'shared'
import Head from 'next/head'

import { APP_URL, MAIL_SERVER_URL } from '../constants/env'
import { ProfileComponent } from '../components/Profile'

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
  const [isMounted, setIsMounted] = useState(false)

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
  useDidMount(() => {
    setIsMounted(true)
  })
  return (
    <NavbarContainer>
      <Flex className="nav">
        <NextLink href="/" passHref>
          <LinkButton>
            <Logo />
          </LinkButton>
        </NextLink>
        {isMounted ? (
          <Flex alignItems="center" position="absolute" right="20px">
            {address ? (
              <Button
                as="a"
                target="_blank"
                href={APP_URL}
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
            ) : null}
          </Flex>
        ) : null}
      </Flex>
    </NavbarContainer>
  )
}

const ProfilePage: NextPage<{ errorCode: number; address: string }> = ({
  errorCode,
  address,
}) => {
  const account = useLoginAccount()
  const router = useRouter()
  const { id } = router.query as { id: string }

  if (errorCode) {
    return <ErrorPage statusCode={errorCode} />
  }

  return (
    <>
      <Head>
        <title>Mail3: Profile Page</title>
      </Head>
      <Flex padding={0} flexDirection="column" position="relative">
        <Navbar address={account || address} />
      </Flex>
      <ProfileComponent mailAddress={`${id}@${MAIL_SERVER_URL}`} address={id} />
    </>
  )
}

export default ProfilePage
