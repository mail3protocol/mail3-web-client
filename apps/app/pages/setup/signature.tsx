import React from 'react'
import { Button, PageContainer } from 'ui'
import { useTranslation } from 'react-i18next'
import { TrackEvent, useTrackClick } from 'hooks'
import { Center, Heading, Text } from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons'
import { RoutePath } from '../../route/path'
import { SettingSignature } from '../../components/Settings/SettingSignature'
import { SettingContainer } from '../../components/Settings/SettingContainer'
import { useRedirectHome } from '../../hooks/useRedirectHome'
import { RouterLink } from '../../components/RouterLink'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

export const SetupSignaturePage = () => {
  const [t] = useTranslation('settings')
  const trackNext = useTrackClick(TrackEvent.ClickSignatureNext)
  const { isAuth, redirectHome } = useRedirectHome()
  useDocumentTitle('Setup Signature')
  if (!isAuth) {
    return redirectHome()
  }

  return (
    <PageContainer>
      <SettingContainer>
        <Center
          position="relative"
          w="100%"
          mb="20px"
          mt={['20px', '20px', '40px']}
        >
          <Heading fontSize={['20px', '20px', '28px']}>
            {t('setup.signature.title')}
          </Heading>
          <RouterLink href={RoutePath.SetupShare} passHref>
            <Button
              bg="black"
              color="white"
              className="next-header"
              position="absolute"
              right="60px"
              onClick={() => trackNext()}
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
        <SettingSignature />
      </SettingContainer>
    </PageContainer>
  )
}
