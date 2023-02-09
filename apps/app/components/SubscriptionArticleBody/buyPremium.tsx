import {
  Box,
  Button as RawButton,
  Center,
  Icon,
  Link,
  Text,
} from '@chakra-ui/react'
import styled from '@emotion/styled'
import { Trans, useTranslation } from 'react-i18next'
import { ReactComponent as SvgDiamond } from 'assets/subscribe-page/diamond.svg'

const CoverContainer = styled(Center)`
  width: 100%;
  margin-top: 24px;
  flex-direction: column;
  justify-content: flex-start;

  background: linear-gradient(180deg, #ffffff 0%, #eef0ff 100%);
  border: 1px solid #9093f9;
  border-radius: 16px;
`

export const BuyPremium: React.FC = () => {
  const [t] = useTranslation(['subscription-article', 'common'])

  return (
    <CoverContainer
      h={{ base: '400px', md: '450px' }}
      p={{ base: '20px', md: '32px' }}
    >
      <Center
        w={{ base: '100%', md: '70%' }}
        p={{ base: '8px 10px', md: '8px 24px' }}
        background="rgba(144, 147, 249, 0.2)"
        borderRadius="24px"
        fontWeight="400"
        fontSize="14px"
        lineHeight="20px"
        color="#4E52F5"
        textAlign="center"
      >
        {t('cover-access')}
      </Center>

      <Center
        mt={{ base: '14px', md: '40px' }}
        flexDirection="column"
        p={{ base: '32px 24px', md: '32px' }}
        width={{ base: 'full', md: '369px' }}
        height="208px"
        background="rgba(255, 255, 255, 0.7)"
        border="1px solid #CCCDFF"
        borderRadius="24px"
      >
        <Text
          fontWeight="400"
          fontSize="14px"
          lineHeight="20px"
          color="#333333"
          textAlign="center"
        >
          <Trans
            components={{
              b: <Box as="span" color="#4E51F4" fontWeight={700} />,
            }}
            values={{ name: 'nickname' }}
            i18nKey="cover-buy-text"
            t={t}
          />
        </Text>
        <Center
          mt="8px"
          color="#FF6A00"
          fontWeight="600"
          fontSize="12px"
          lineHeight="16px"
        >
          {t('from-year', { num: 8 })}
        </Center>

        <Center
          as={RawButton}
          variant="unstyled"
          leftIcon={<Icon as={SvgDiamond} w="20px" h="20px" />}
          mt="20px"
          w="141px"
          h="36px"
          background="linear-gradient(84.31deg, #4E52F5 2.72%, #ACAEFF 53.3%, #4E52F5 98.41%)"
          borderRadius="24px"
          color="#fff"
          fontSize="18px"
          fontWeight="700"
          lineHeight="20px"
          _active={{
            opacity: 0.5,
          }}
        >
          {t('buy')}
        </Center>
      </Center>

      <Center mt="24px" fontWeight="400" fontSize="12px" lineHeight="18px">
        <Trans
          components={{
            b: <Box as="span" fontWeight={600} ml="2px" />,
          }}
          values={{ name: 'nickname' }}
          i18nKey="cover-already"
          t={t}
        />
      </Center>
      <Link
        mt="8px"
        fontWeight="400"
        fontSize="12px"
        lineHeight="18px"
        color="#4E52F5"
        onClick={() => {}}
      >
        {t('switch-wallet')}
      </Link>
    </CoverContainer>
  )
}
