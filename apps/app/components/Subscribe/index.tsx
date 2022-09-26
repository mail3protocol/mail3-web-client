import { Center, Heading, HStack, Image, Box } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Welcomepng from '../../assets/subscribe/welcome.png'
import { useAuth, useIsAuthenticated } from '../../hooks/useLogin'
import { ConnectModalWithMultichain } from '../ConnectWallet/ConnectModalWithMultichain'

const ConnectWallet = () => {
  const [t] = useTranslation('subscribe')
  return (
    <Center mt="40px">
      <Center
        padding="32px"
        border="1px solid #efefef"
        borderRadius="24px"
        flexDirection="column"
      >
        <Heading mb="32px" fontSize="20px" fontWeight={700}>
          {t('connect')}
        </Heading>
        <HStack spacing="48px">
          <Center>
            <Image src={Welcomepng} w="191px" />
          </Center>
          <Box>
            <ConnectModalWithMultichain show isOpen onClose={() => {}} />
          </Box>
        </HStack>
      </Center>
    </Center>
  )
}

export const Subscribe: React.FC = () => {
  useAuth()
  const isAuth = useIsAuthenticated()

  if (!isAuth) {
    return <ConnectWallet />
  }

  return <div>connect</div>
}
