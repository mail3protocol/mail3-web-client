import { useDidMount, useLoginAccount } from 'hooks'
import { GetServerSideProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import React, { useMemo, useState } from 'react'
import ErrorPage from 'next/error'
import styled from '@emotion/styled'
import { Flex, Button, Text, Link } from '@chakra-ui/react'
import { Avatar, Logo } from 'ui'
import { useRouter } from 'next/router'
import { isSupportedAddress, truncateMiddle } from 'shared'
import Head from 'next/head'

import { APP_URL, MAIL_SERVER_URL } from '../constants/env'
import { ProfileComponent } from '../components/Profile'
import { getAPI } from '../api'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const api = getAPI
  const { locale, resolvedUrl } = context
  const [address] = resolvedUrl.slice(1).split('?')
  const errorCode = isSupportedAddress(address) ? false : 404

  let isProject = false

  try {
    const retProject = await api.checkIsProject(address)
    if (retProject.status === 200) {
      isProject = true
    }
  } catch (error) {
    // console.log('error', error)
  }

  return {
    props: {
      isProject,
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
        <Link href={APP_URL} isExternal>
          <Logo />
        </Link>
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

const ProfilePage: NextPage<{
  errorCode: number
  address: string
  isProject: boolean
}> = ({ errorCode, address, isProject }) => {
  const account = useLoginAccount()
  const router = useRouter()
  const { id } = router.query as { id: string }
  const emailAddress = `${id}@${MAIL_SERVER_URL}`
  if (errorCode) {
    return <ErrorPage statusCode={errorCode} />
  }

  return (
    <>
      <Head>
        <title>Mail3: Profile Page - {emailAddress}</title>
      </Head>
      <Flex padding={0} flexDirection="column" position="relative">
        <Navbar address={account || address} />
      </Flex>
      <ProfileComponent
        mailAddress={emailAddress}
        address={id}
        isProject={isProject}
      />
    </>
  )
}

export default ProfilePage
