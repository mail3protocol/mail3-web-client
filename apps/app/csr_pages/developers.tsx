import { PageContainer } from 'ui'
import React from 'react'
import { Box, Flex, Heading, VStack } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { TrackEvent, useTrackClick } from 'hooks'
import { InboxNav } from '../components/Inbox/Nav'
import { PaperContainer } from '../components/PaperContainer'
import DevelopersMail3MeButtonExamplePng from '../assets/developers/mail3_me_button.png'
import DevelopersSubscribeButtonExamplePng from '../assets/developers/subscribe_button.png'

import {
  GITHUB_MAIL3_ME_BUTTON_URL,
  MAIL3_ME_BUTTON_MIRROR_URL,
  GITHUB_SUBSCRIBE_BUTTON_URL,
  SUBSCRIBE_BUTTON_MIRROR_URL,
} from '../constants'
import { GoToWriteMailButton } from '../components/GoToWriteMailButton'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { Item, ItemLink } from '../components/Developers'

export const Developers: React.FC = () => {
  const [t] = useTranslation('developers')
  const trackClickMmbMirror = useTrackClick(TrackEvent.ClickMmbMirror)
  const trackClickMmbGithub = useTrackClick(TrackEvent.ClickMmbGithub)
  const trackClickSubMirror = useTrackClick(TrackEvent.ClickSubMirror)
  const trackClickSubGithub = useTrackClick(TrackEvent.ClickSubGithub)

  useDocumentTitle('Developers')

  return (
    <Box pt={{ base: '25px', md: '35px' }}>
      <PageContainer>
        <Flex justify="space-between">
          <InboxNav initialScrollX={400} />
          <GoToWriteMailButton />
        </Flex>
      </PageContainer>

      <PaperContainer>
        <Heading fontSize="20px" lineHeight="30px" mb="13px">
          {t('title')}
        </Heading>
        <VStack spacing="24px" pb="50px">
          <Item
            title={t('subscribe-button.title')}
            description={t('subscribe-button.description')}
            descriptionBgColor="rgba(214, 255, 220, 1)"
            image={DevelopersSubscribeButtonExamplePng}
            links={
              <>
                <ItemLink
                  href={SUBSCRIBE_BUTTON_MIRROR_URL}
                  onClick={() => trackClickSubMirror()}
                  icon="mirror"
                  text={t('subscribe-button.mirror')}
                />
                <ItemLink
                  href={GITHUB_SUBSCRIBE_BUTTON_URL}
                  onClick={() => trackClickSubGithub()}
                  icon="subscribe"
                  text={t('subscribe-button.github')}
                />
              </>
            }
          />
          <Item
            title={t('mail3-me-button.title')}
            description={t('mail3-me-button.description')}
            descriptionBgColor="rgba(78, 82, 245, 0.1)"
            image={DevelopersMail3MeButtonExamplePng}
            links={
              <>
                <ItemLink
                  href={MAIL3_ME_BUTTON_MIRROR_URL}
                  onClick={() => trackClickMmbMirror()}
                  icon="mirror"
                  text={t('mail3-me-button.mirror')}
                />
                <ItemLink
                  href={GITHUB_MAIL3_ME_BUTTON_URL}
                  onClick={() => trackClickMmbGithub()}
                  icon="github"
                  text={t('mail3-me-button.github')}
                />
              </>
            }
          />
        </VStack>
      </PaperContainer>
    </Box>
  )
}
