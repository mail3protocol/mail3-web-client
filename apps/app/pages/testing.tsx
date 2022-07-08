import React from 'react'
import { Center, Link, Icon } from '@chakra-ui/react'
import { PageContainer } from 'ui'
import { ReactComponent as LogoSvg } from 'assets/svg/logo-pure.svg'
import { HOME_URL, NAVBAR_HEIGHT } from '../constants'
import { Testing } from '../components/Testing'

const Navbar = () => (
  <Center h={`${NAVBAR_HEIGHT}px`}>
    <Link isExternal href={HOME_URL}>
      <Icon as={LogoSvg} w="124px" h="auto" />
    </Link>
  </Center>
)

export const TestingPage = () => (
  <>
    {/* <Head>
      <title>Mail3: Beta</title>
    </Head> */}
    <PageContainer>
      <Navbar />
      <Testing />
    </PageContainer>
  </>
)
