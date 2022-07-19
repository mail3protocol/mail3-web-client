import { GithubIcon, MirrorIcon, RightArrowIcon, PageContainer } from 'ui'
import React from 'react'
import {
  Box,
  Center,
  Flex,
  Grid,
  Heading,
  VStack,
  Image,
  Link,
  Text,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { TrackEvent, useTrackClick } from 'hooks'
import { InboxNav } from '../components/Inbox/Nav'
import { PaperContainer } from '../components/PaperContainer'
import DevelopersMail3MeButtonExamplePng from '../assets/developers-mail3-me-button-example.png'
import {
  GITHUB_MAIL3_ME_BUTTON_URL,
  MAIL3_ME_BUTTON_MIRROR_URL,
} from '../constants'
import { GoToWriteMailButton } from '../components/GoToWriteMailButton'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export const Developers: React.FC = () => {
  const [t] = useTranslation('developers')
  const trackClickMmbMirror = useTrackClick(TrackEvent.ClickMmbMirror)
  const trackClickMmbGithub = useTrackClick(TrackEvent.ClickMmbGithub)
  useDocumentTitle('Developers')

  return (
    <Box pt={{ base: '25px', md: '35px' }}>
      <PageContainer>
        <Flex justify="space-between">
          <InboxNav />
          <GoToWriteMailButton />
        </Flex>
      </PageContainer>

      <PaperContainer>
        <Heading fontSize="20px" lineHeight="30px">
          {t('title')}
        </Heading>
        <Grid
          templateColumns={{ base: 'full', lg: '418px 1fr' }}
          templateRows={{ base: 'min(228px, 1fr) 1fr', lg: 'full' }}
          bg="#F3F3F3"
          rounded="24px"
          p="16px"
          mt="13px"
          gridColumnGap="42px"
          gridRowGap="10px"
        >
          <Flex direction="column">
            <Center pt="29px" bg="#fff" borderTopRadius="16px">
              <Image
                src={DevelopersMail3MeButtonExamplePng}
                alt="example"
                w="214px"
                h="92px"
                mb="29px"
                objectFit="contain"
              />
            </Center>
            <Box
              borderBottomRadius="16px"
              bg="rgba(78, 82, 245, 0.1)"
              px="14px"
              py="10px"
            >
              <Heading as="h3" fontSize="18px">
                {t('example-title')}
              </Heading>
              <Text fontSize="12px" mt="7px">
                {t('example-description')}
              </Text>
            </Box>
          </Flex>
          <VStack
            spacing={{ base: '6px', md: '10px' }}
            fontSize={{ base: '12px', md: '16px' }}
            fontWeight="500"
            css={`
              .item {
                width: 100%;
                display: flex;
                background-color: #fff;
                border-radius: 16px;
                height: 66px;
                align-items: center;
                padding: 0 11px;
              }
              .item:hover {
                text-decoration: none;
                transform: scale(1.02);
              }
              .item:active {
                transform: scale(1);
              }
            `}
          >
            <Link
              className="item"
              href={MAIL3_ME_BUTTON_MIRROR_URL}
              target="_blank"
              onClick={() => {
                trackClickMmbMirror()
              }}
            >
              <MirrorIcon w="28px" h="28px" />
              <Box ml={{ base: '7px', md: '18px' }}>{t('mirror')}</Box>
              <RightArrowIcon
                w={{ base: '20px', md: '24px' }}
                h={{ base: '20px', md: '24px' }}
                ml="auto"
              />
            </Link>
            <Link
              className="item"
              href={GITHUB_MAIL3_ME_BUTTON_URL}
              target="_blank"
              onClick={() => {
                trackClickMmbGithub()
              }}
            >
              <GithubIcon w="28px" h="28px" />
              <Box ml={{ base: '7px', md: '18px' }}>
                {t('github.0')}
                <sup>{t('github.1')}</sup>
                {t('github.2')}
              </Box>
              <RightArrowIcon
                w={{ base: '20px', md: '24px' }}
                h={{ base: '20px', md: '24px' }}
                ml="auto"
              />
            </Link>
          </VStack>
        </Grid>
      </PaperContainer>
    </Box>
  )
}
