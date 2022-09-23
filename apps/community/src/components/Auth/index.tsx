import { useTranslation } from 'react-i18next'
import { Button, Flex, Icon, Text } from '@chakra-ui/react'
import { truncateMiddle } from 'shared'
import React from 'react'
import { useAccount } from 'hooks'
import { ReactComponent as WalletSvg } from 'assets/svg/wallet.svg'
import { useNavigate } from 'react-router-dom'
import { RoutePath } from '../../route/path'

export const AuthContent: React.FC = () => {
  const { t } = useTranslation('components')
  const account = useAccount()
  const navi = useNavigate()

  return (
    <>
      {t('auth_connect_wallet.description')}
      <Flex
        w="100%"
        align="center"
        justify="space-between"
        bg="containerBackground"
        rounded="100px"
        px="20px"
        lineHeight="40px"
        mt="20px"
      >
        <Text fontWeight={600} fontSize="16px">
          {truncateMiddle(account, 6, 4)}
        </Text>
        <Icon as={WalletSvg} w="24px" h="24px" />
      </Flex>
      <Button
        isFullWidth
        mt="20px"
        variant="solid-rounded"
        colorScheme="primaryButton"
        onClick={() => {
          navi(RoutePath.Dashboard)
        }}
      >
        {t('auth_connect_wallet.remember')}
      </Button>
    </>
  )
}
