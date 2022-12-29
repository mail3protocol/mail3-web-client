import React from 'react'
import { Flex } from '@chakra-ui/react'
import { Logo, PageContainer } from 'ui'
import { Link } from 'react-router-dom'
import { MAIL_SERVER_URL, NAVBAR_HEIGHT } from '../constants'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { SubscribeProfileBody } from '../components/SubscribeProfileBody'
import { RoutePath } from '../route/path'

const Navbar = () => (
  <Flex
    h={`${NAVBAR_HEIGHT}px`}
    alignItems="center"
    justifyContent={['flex-start', 'center', 'center']}
  >
    <Link to={RoutePath.Home}>
      <Logo textProps={{ color: '#231815' }} />
    </Link>
  </Flex>
)

export const SubscribeProfile: React.FC<{
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
