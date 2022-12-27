import React, { useMemo } from 'react'
import { Box, Center, Flex } from '@chakra-ui/react'
import { Logo, PageContainer } from 'ui'
import { Link, useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { isPrimitiveEthAddress, isSupportedAddress } from 'shared'
import styled from '@emotion/styled'
import { MAIL_SERVER_URL, NAVBAR_HEIGHT } from '../constants'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { SubscribeProfileBody } from '../components/SubscribeProfileBody'
import { RoutePath } from '../route/path'
import { useAPI } from '../hooks/useAPI'

const ErrPage = styled(Center)`
  height: 100vh;

  .code {
    display: inline-block;
    border-right: 1px solid rgba(0, 0, 0, 0.3);
    margin: 0;
    margin-right: 20px;
    padding: 10px 23px 10px 0;
    font-size: 24px;
    font-weight: 500;
    vertical-align: top;
  }
  .text {
    display: inline-block;
    text-align: left;
    line-height: 49px;
    height: 49px;
    vertical-align: middle;
    font-size: 14px;
  }
`

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

export const SubscribeProfile = () => {
  useDocumentTitle('Mail3: Subsribe Page')
  const { id: address } = useParams() as { id: string }
  const api = useAPI()

  const { isLoading, data } = useQuery(['subscribe profile init'], async () => {
    let errorCode = isSupportedAddress(address) ? false : 404
    let uuid = ''
    let priAddress = address

    try {
      const retProject = await api.checkIsProject(address)
      if (retProject.status === 200) {
        uuid = retProject.data.uuid
      }
    } catch (error) {
      errorCode = 404
    }

    try {
      if (!isPrimitiveEthAddress(priAddress)) {
        const retAddress = await api.getPrimitiveAddress(address)
        if (retAddress.status === 200) {
          priAddress = retAddress.data.eth_address
        }
      }
    } catch (error) {
      errorCode = 404
    }

    return {
      errorCode,
      uuid,
      priAddress,
    }
  })

  const Content = useMemo(() => {
    if (data?.errorCode !== 404 && data?.uuid && data.priAddress) {
      return (
        <SubscribeProfileBody
          mailAddress={`${address}@${MAIL_SERVER_URL}`}
          address={address}
          uuid={data.uuid}
          priAddress={data.priAddress}
        />
      )
    }
    return null
  }, [data, address])

  if (data?.errorCode === 404) {
    return (
      <ErrPage>
        <Center>
          <Box className="code">404</Box>
          <Box className="text">This page could not be found.</Box>
        </Center>
      </ErrPage>
    )
  }

  return (
    <>
      <PageContainer>
        <Navbar />
      </PageContainer>
      {!isLoading ? Content : null}
    </>
  )
}
