import { Flex, Heading, Text, Center, Box, Icon } from '@chakra-ui/react'
import React, { useMemo } from 'react'
import { useTranslation } from 'next-i18next'
import { Button, ConnectWallet } from 'ui'
import { useAccount } from 'hooks'
import Mail3BackgroundSvg from 'assets/svg/mail3Background.svg'
import { Navbar } from '../Navbar'
import { Container } from '../Container'
import { Mascot } from './Mascot'
import { FooterText } from './FooterText'
import { QualificationText } from './QualificationText'
import { getDateRangeFormat } from '../../utils/whitelist'
import { BETA_TESTING_DATE_RANGE } from '../../constants/env'

export const Testing: React.FC = () => {
  const { t } = useTranslation('testing')
  const account = useAccount()
  const isQualified = true
  const mascotIndex = useMemo(() => {
    if (!account) return 1
    if (isQualified) return 2
    return 3
  }, [account, isQualified])
  return (
    <Flex
      direction="column"
      align="center"
      minH="100vh"
      px={{ base: 0, md: '40px' }}
    >
      <Navbar headingText={t('beta-testing')} />
      <Container py={{ base: '30px', md: '62px' }}>
        <Flex
          direction="column"
          justify="space-between"
          align="center"
          w="full"
          my="auto"
          h="full"
          maxH={{
            base: '607px',
            md: '700px',
          }}
          flex={1}
        >
          <Icon
            as={Mail3BackgroundSvg}
            position="absolute"
            left="50%"
            top="50%"
            transform="translate(-50%, -50%)"
            w="calc(100% - 12px)"
            maxW="955px"
            h="auto"
            zIndex="-2"
          />
          <Heading
            fontSize={{
              base: '24px',
              md: '36px',
            }}
            pt={{ base: '0', md: '6px' }}
          >
            {t('heading')}
          </Heading>
          <Flex
            direction="column"
            textAlign="center"
            whiteSpace="pre-line"
            fontSize={{
              base: '16px',
              md: '24px',
            }}
          >
            {account ? (
              <QualificationText isQualified={isQualified} />
            ) : (
              <>
                <Heading lineHeight="44px" fontSize="24px">
                  {t('connect_wallet')}
                </Heading>
                <Text
                  mt={{
                    base: '6px',
                    h: '1px',
                  }}
                  lineHeight="28px"
                >
                  {t('connect_wallet_tips')}
                </Text>
              </>
            )}
          </Flex>
          <Flex direction="column" align="center">
            <Center h="140px" maxW="200px">
              <Mascot imageIndex={mascotIndex} />
            </Center>
            <ConnectWallet
              renderConnected={(address) => (
                <Button variant="outline">
                  {address.substring(0, 6)}…
                  {address.substring(address.length - 4)}
                </Button>
              )}
            />
          </Flex>
          <Box
            fontSize={{
              base: '14px',
              md: '16px',
            }}
            mb={{
              base: '30px',
              md: '120px',
            }}
            textAlign="center"
            whiteSpace="pre-line"
          >
            {account ? (
              <FooterText isQualified={isQualified} />
            ) : (
              <>
                {t('testing-period', {
                  date: getDateRangeFormat(BETA_TESTING_DATE_RANGE),
                })}
              </>
            )}
          </Box>
        </Flex>
      </Container>
    </Flex>
  )
}
