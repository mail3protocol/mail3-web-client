import {
  Box,
  BoxProps,
  Button,
  ButtonProps,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  HStack,
  Icon,
  Image,
  Input,
  Link,
  Switch,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
  useStyleConfig,
  VStack,
} from '@chakra-ui/react'
import { Avatar, ProfileCardHome } from 'ui'
import {
  CommunityQRcodeStyle,
  TrackEvent,
  TrackKey,
  useAccount,
  useCopyWithStatus,
  useLoginInfo,
  useScreenshot,
  useTrackClick,
} from 'hooks'
import dayjs from 'dayjs'
import axios from 'axios'
import QrCode from 'qrcode.react'
import styled from '@emotion/styled'
import { useQuery } from 'react-query'
import { ClusterInfoResp } from 'models'
import { Trans, useTranslation } from 'react-i18next'
import React, { useMemo, useRef, useState } from 'react'
import { ReactComponent as SvgRank } from 'assets/svg/rank.svg'
import { ReactComponent as SvgCollect } from 'assets/svg/collect.svg'
import { ReactComponent as CopySvg } from 'assets/svg/copy.svg'
import { truncateAddress } from 'shared'
import { AddIcon, CheckIcon } from '@chakra-ui/icons'
import { Container } from '../components/Container'
import { ReactComponent as DownloadSvg } from '../assets/download.svg'
import BannerPng from '../assets/banner.png'
import { QueryKey } from '../api/QueryKey'
import { useAPI } from '../hooks/useAPI'
import { useSetUserInfo, useUserInfo } from '../hooks/useUserInfo'
import { APP_URL, HOME_URL } from '../constants/env/url'
import { MAIL_SERVER_URL } from '../constants/env/mailServer'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { TipsPanel } from '../components/TipsPanel'

export const DownloadButton: React.FC<
  ButtonProps & { href?: string; download?: string }
> = ({ ...props }) => {
  const { t } = useTranslation('user_information')
  return (
    <Button
      leftIcon={<Icon as={DownloadSvg} w="16px" h="16px" />}
      variant="link"
      fontSize="14px"
      colorScheme="primaryButton"
      {...props}
    >
      {t('download')}
    </Button>
  )
}

const Title = styled(Box)`
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  padding: 16px 0 8px;
`

export const Information: React.FC = () => {
  useDocumentTitle('Information')
  const { t } = useTranslation(['user_information', 'common'])
  const cardStyleProps = useStyleConfig('Card') as BoxProps
  const account = useAccount()
  const api = useAPI()
  const loginInfo = useLoginInfo()
  const userInfo = useUserInfo()
  const setUserInfo = useSetUserInfo()
  const [currentAvatar, setCurrentAvatar] = useState<string | undefined>(
    undefined
  )
  const { data: userInfoData } = useQuery(
    [QueryKey.GetUserInfo],
    async () => api.getUserInfo().then((r) => r.data),
    {
      onSuccess(d) {
        setUserInfo({
          ...d,
          next_refresh_time: dayjs().add(1, 'day').format(),
        })
      },
    }
  )
  const { data: nftInfo } = useQuery(
    ['cluster', account],
    async () => {
      const res = await axios.get<ClusterInfoResp>(
        `https://openApi.cluster3.net/api/v1/communityUserInfo?uuid=b45339c7&address=${account}`
      )
      return res.data.data
    },
    {
      refetchIntervalInBackground: false,
      refetchOnMount: true,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  )

  const cardRef = useRef<HTMLDivElement>(null)
  const qrcodeRef = useRef<HTMLDivElement>(null)
  const { takeScreenshot, downloadScreenshot } = useScreenshot()
  const { data: profileImage } = useQuery(
    ['RenderProfileImage', account, nftInfo, currentAvatar],
    () =>
      takeScreenshot(cardRef.current!, {
        scale: 3,
      }),
    {
      enabled: !!cardRef.current && !!account,
    }
  )

  const trackClickInformationQRcodeDownload = useTrackClick(
    TrackEvent.CommunityClickInformationQRcodeDownload
  )

  const { onCopy, isCopied } = useCopyWithStatus()
  const profilePageUrl = `${HOME_URL}/${userInfo?.address.split('@')[0] || ''}`

  const hasBanner = true

  return (
    <Container as={Grid} gridTemplateColumns="3fr 1fr" gap="20px">
      <Flex
        direction="column"
        align="center"
        {...cardStyleProps}
        w="full"
        h="full"
        p="32px"
      >
        <Flex justifyContent="space-between" w="full">
          <Heading fontSize="18px" lineHeight="20px">
            {t('title')}
          </Heading>
          <Button
            h="28px"
            w="94px"
            variant="solid-rounded"
            colorScheme="primaryButton"
            type="submit"
            // isLoading={isUpdating}
            // isDisabled={isDisabledSubmit}
            // style={{ opacity: isLoading ? 0 : undefined }}
          >
            {t('dublish')}
          </Button>
        </Flex>
        <Tabs w="full" variant="normal" mt="38px">
          <TabList>
            <Tab>{t('tabs.Branding_Promotion')}</Tab>
            <Tab>{t('tabs.Items')}</Tab>
            <Tab>{t('tabs.Basic_info')}</Tab>
          </TabList>

          <TabPanels>
            <TabPanel p="32px 0">
              <FormControl w="400px">
                <Title>{t('subscribe_link')}</Title>
                <Box position="relative">
                  <Input
                    name="profile_page_url"
                    isDisabled
                    value={profilePageUrl}
                  />
                  <Tooltip
                    label={t(isCopied ? 'copied' : 'copy', {
                      ns: 'common',
                    })}
                    placement="top"
                    hasArrow
                  >
                    <Button
                      variant="unstyled"
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      h="full"
                      position="absolute"
                      top="0"
                      right="0"
                      w="40px"
                      onClick={() => onCopy(profilePageUrl)}
                      style={{ cursor: isCopied ? 'default' : undefined }}
                    >
                      {isCopied ? (
                        <CheckIcon w="16px" h="16px" />
                      ) : (
                        <Icon as={CopySvg} w="20px" h="20px" />
                      )}
                    </Button>
                  </Tooltip>
                </Box>
              </FormControl>

              <Title>{t('avatar')}</Title>
              <HStack spacing="24px">
                <Center
                  background="#F2F2F2"
                  borderRadius="8px"
                  w="128px"
                  h="96px"
                >
                  <Center
                    w="84px"
                    h="84px"
                    bg="informationAvatarBackground"
                    rounded="full"
                    boxShadow="0px 0px 8px rgba(0, 0, 0, 0.16)"
                  >
                    <Avatar
                      address={userInfo?.address.split('@')[0] || ''}
                      w="80px"
                      h="80px"
                      borderRadius="50%"
                    />
                  </Center>
                </Center>
                <Box>
                  <Box fontWeight="500" fontSize="14px" lineHeight="20px">
                    {t('avatar_p')}
                  </Box>
                  <Box
                    mt="16px"
                    fontWeight="400"
                    fontSize="12px"
                    lineHeight="16px"
                  >
                    <Trans
                      t={t}
                      i18nKey="avatar_setting"
                      components={{
                        a: (
                          <Link
                            color="primary.900"
                            href={APP_URL}
                            target="_blank"
                          />
                        ),
                        span: <Box as="span" color="#FF6B00" />,
                      }}
                    />
                  </Box>
                </Box>
              </HStack>
              <Title>{t('banner_image')}</Title>
              <Center
                w="610px"
                h="100px"
                justifyContent="center"
                bgImage={BannerPng}
                bgSize="auto 100%"
                bgRepeat="no-repeat"
                bgPosition="center"
                borderRadius="8px"
              >
                <Center
                  w="full"
                  h="full"
                  flexDirection="column"
                  bg="rgba(0, 0, 0, 0.2)"
                  backdropFilter="blur(10px)"
                  opacity="0"
                  transition="opacity .3s ease"
                  _hover={{
                    opacity: '1',
                  }}
                >
                  <Text
                    textAlign="center"
                    fontWeight="400"
                    fontSize="12px"
                    lineHeight="16px"
                    color="#fff"
                    userSelect="none"
                  >
                    <Trans
                      t={t}
                      i18nKey="upload.prompt"
                      components={{
                        span: <Box as="span" color="#FF6B00" />,
                      }}
                    />
                  </Text>
                  <Center mt="5px">
                    <Button
                      leftIcon={<AddIcon />}
                      variant="upload"
                      colorScheme="primaryButton"
                    >
                      {t('upload.button')}
                    </Button>
                    {hasBanner ? (
                      <Button
                        variant="ghost"
                        ml="5px"
                        color="#fff"
                        fontSize="12px"
                        fontWeight="600"
                        lineHeight="14px"
                        height="28px"
                        _active={{ bg: 'transparent' }}
                        _hover={{ bg: 'transparent' }}
                      >
                        {t('upload.remove')}
                      </Button>
                    ) : null}
                  </Center>
                </Center>
              </Center>

              <FormControl w="400px">
                <Title>{t('qr_code')}</Title>
                <Grid
                  templateColumns="repeat(2, 1fr)"
                  templateRows="100%"
                  h="232px"
                  gap="8px"
                >
                  <Center
                    bg="containerBackground"
                    border="1px solid"
                    borderColor="previewBorder"
                    rounded="14px"
                    p="16px"
                    flexDirection="column"
                  >
                    <Flex justify="center" mb="16px" h="165px">
                      <ProfileCardHome
                        homeUrl={HOME_URL}
                        mailAddress={
                          userInfo?.address || `${account}@${MAIL_SERVER_URL}`
                        }
                        ref={cardRef}
                        nickname={truncateAddress(
                          userInfo?.name ||
                            userInfoData?.name ||
                            userInfo?.address.split('@')[0] ||
                            '',
                          '_'
                        )}
                        onChangeAvatarCallback={setCurrentAvatar}
                      >
                        <Center
                          w="325px"
                          h="64px"
                          background="#F3F3F3"
                          borderRadius="16px"
                          color="#000000"
                          fontSize="12px"
                          fontWeight="500"
                          justifyContent="space-around"
                          lineHeight={1}
                        >
                          <Box textAlign="center">
                            <Center mt="-7px">
                              <SvgRank />
                            </Center>
                            <Box p="3px" mt="-5px">
                              {t('collection_rank')}
                            </Box>
                            <Box mt="3px">{nftInfo?.ranking}</Box>
                          </Box>
                          <Box>
                            <Center mt="-7px">
                              <SvgCollect />
                            </Center>
                            <Center p="3px" mt="-5px">
                              {t('collected')}
                            </Center>
                            <Center mt="3px">
                              <Box color="#4E52F5" mr="2px">
                                {useMemo(
                                  () =>
                                    nftInfo?.poapList.filter((e) => e.hadGot)
                                      .length ?? 0,
                                  [nftInfo?.poapList]
                                )}
                              </Box>
                              /{' '}
                              <Box ml="2px">
                                {nftInfo?.poapList.length ?? 0}
                              </Box>
                            </Center>
                          </Box>
                        </Center>
                      </ProfileCardHome>
                      {profileImage ? (
                        <Image
                          src={profileImage}
                          alt="profile_card"
                          h="full"
                          w="auto"
                        />
                      ) : null}
                    </Flex>
                    <DownloadButton
                      mt="auto"
                      as="a"
                      href={profileImage}
                      download={`profile_card_${account}.png`}
                      onClick={() => {
                        trackClickInformationQRcodeDownload({
                          [TrackKey.CommunityQRcodeStyle]:
                            CommunityQRcodeStyle.Mail3Style,
                        })
                      }}
                    />
                  </Center>
                  <Center
                    bg="containerBackground"
                    border="1px solid"
                    borderColor="previewBorder"
                    rounded="14px"
                    p="16px"
                    flexDirection="column"
                  >
                    <Center
                      w="full"
                      h="full"
                      mb="16px"
                      bg="informationQrCodeBackground"
                      rounded="8px"
                      ref={qrcodeRef}
                    >
                      <QrCode
                        value={`${APP_URL}/subscribe/${loginInfo?.uuid}`}
                        size={272}
                        fgColor="black"
                        style={{ width: '68px', height: '68px' }}
                      />
                    </Center>
                    <DownloadButton
                      mt="auto"
                      onClick={() => {
                        trackClickInformationQRcodeDownload({
                          [TrackKey.CommunityQRcodeStyle]:
                            CommunityQRcodeStyle.PureStyle,
                        })
                        downloadScreenshot(
                          qrcodeRef.current!,
                          `qrcode_${account}.png`,
                          {
                            scale: 3,
                          }
                        )
                      }}
                    />
                  </Center>
                </Grid>
              </FormControl>
            </TabPanel>
            <TabPanel>
              <Title>{t('cluster3_Link')}</Title>
              <FormControl>
                <Input
                  placeholder="Link"
                  // name="campaign_link"
                  // isDisabled={isDisabled}
                  // value={campaignUrl}
                  // onChange={({ target: { value } }) => setCampaignUrl(value)}
                />
              </FormControl>
              <Text
                fontWeight="500"
                fontSize="12px"
                lineHeight="20px"
                p="5px 0"
              >
                {t('appear')}
              </Text>
              <Text fontWeight="400" fontSize="12px" lineHeight="18px">
                <Trans
                  t={t}
                  i18nKey="appear_text"
                  components={{
                    a: (
                      <Link
                        fontWeight={700}
                        color="primary.900"
                        href={APP_URL}
                        target="_blank"
                      />
                    ),
                    b: <b />,
                  }}
                />
              </Text>
            </TabPanel>
            <TabPanel>
              <Flex w="full" h="full" direction="column">
                <VStack as="form" spacing="24px" mt="32px" w="400px">
                  <FormControl>
                    <FormLabel>{t('name_field')}</FormLabel>
                    <Input
                      placeholder={t('name_placeholder')}
                      name="name"
                      isDisabled
                      value={truncateAddress(
                        userInfo?.name ||
                          userInfoData?.name ||
                          userInfo?.address.split('@')[0] ||
                          '',
                        '_'
                      )}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>
                      <Trans
                        t={t}
                        i18nKey="address_field"
                        components={{ sup: <sup /> }}
                      />
                    </FormLabel>
                    <Input
                      placeholder={t('address_placeholder')}
                      name="mail_address"
                      isDisabled
                      value={userInfo?.address || userInfoData?.address}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>{t('profile_page_field')}</FormLabel>
                    <Box position="relative">
                      <Input
                        name="profile_page_url"
                        isDisabled
                        value={profilePageUrl}
                      />
                      <Tooltip
                        label={t(isCopied ? 'copied' : 'copy', {
                          ns: 'common',
                        })}
                        placement="top"
                        hasArrow
                      >
                        <Button
                          variant="unstyled"
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          h="full"
                          position="absolute"
                          top="0"
                          right="0"
                          w="40px"
                          onClick={() => onCopy(profilePageUrl)}
                          style={{ cursor: isCopied ? 'default' : undefined }}
                        >
                          {isCopied ? (
                            <CheckIcon w="16px" h="16px" />
                          ) : (
                            <Icon as={CopySvg} w="20px" h="20px" />
                          )}
                        </Button>
                      </Tooltip>
                    </Box>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Mail Me Button</FormLabel>
                    <Flex justifyContent="space-between" alignItems="center">
                      <Box fontWeight="500" fontSize="12px" lineHeight="15px">
                        {t('display_Mail_Me_Button')}
                      </Box>
                      <Switch id="email-alerts" />
                    </Flex>
                  </FormControl>
                </VStack>
              </Flex>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
      <TipsPanel useSharedContent />
    </Container>
  )
}
