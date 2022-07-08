import React from 'react'
import { Button, PageContainer } from 'ui'
import { useTranslation } from 'react-i18next'
import { TrackEvent, useTrackClick } from 'hooks'
import { Center, Heading, Text } from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons'
import { Navbar } from '../../components/Navbar'
import { RoutePath } from '../../route/path'
import { SettingAddress } from '../../components/Settings/SettingAddress'
import { SettingContainer } from '../../components/Settings/SettingContainer'
import { useRedirectHome } from '../../hooks/useRedirectHome'
import { RouterLink } from '../../components/RouterLink'

export const SetupAddressPage = () => {
  const [t] = useTranslation('settings')
  const trackNext = useTrackClick(TrackEvent.ClickAddressNext)
  const { isAuth, redirectHome } = useRedirectHome()
  if (!isAuth) {
    return redirectHome()
  }

  return (
    <>
      {/* <Head>
        <title>Mail3: Setup Address</title>
      </Head> */}
      <PageContainer>
        <Navbar />
        <SettingContainer>
          <Center
            position="relative"
            w="100%"
            mb="20px"
            mt={['20px', '20px', '40px']}
          >
            <Heading fontSize={['20px', '20px', '28px']}>
              {t('setup.address.title')}
            </Heading>
            <RouterLink href={RoutePath.SetupSignature} passHref>
              <Button
                bg="black"
                color="white"
                flex="1"
                className="next-header"
                position="absolute"
                onClick={() => trackNext()}
                right="60px"
                _hover={{
                  bg: 'brand.50',
                }}
                as="a"
                rightIcon={<ChevronRightIcon color="white" />}
              >
                <Center flexDirection="column">
                  <Text>{t('setup.next')}</Text>
                </Center>
              </Button>
            </RouterLink>
          </Center>
          <SettingAddress />
        </SettingContainer>
      </PageContainer>
    </>
  )
}
