import React from 'react'
import { Flex, Link } from '@chakra-ui/react'
import { Logo, PageContainer } from 'ui'
import { MAIL_SERVER_URL, NAVBAR_HEIGHT } from '../../constants'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { RoutePath } from '../../route/path'
import { SubscribeProfileBody } from '../../components/SubscribeProfileBody'

const Navbar = () => (
  <Flex
    h={`${NAVBAR_HEIGHT}px`}
    alignItems="center"
    justifyContent={['flex-start', 'center', 'center']}
  >
    <Link href={RoutePath.Home}>
      <Logo textProps={{ color: '#231815' }} />
    </Link>
  </Flex>
)

export const passToClient = ['pageProps']

export const Page: React.FC<{
  uuid: string
  primitiveAddress: string
  address: string
}> = ({ address, uuid, primitiveAddress }) => {
  useDocumentTitle('Mail3: Subscribe Page')
  return (
    <>
      <PageContainer>
        <Navbar />
      </PageContainer>
      <SubscribeProfileBody
        mailAddress={`${address}@${MAIL_SERVER_URL}`}
        address={address}
        uuid={uuid}
        priAddress={primitiveAddress}
      />
    </>
  )
}
