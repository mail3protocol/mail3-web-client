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
  Input,
  Link,
  Switch,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Textarea,
  Tooltip,
  useStyleConfig,
  VStack,
} from '@chakra-ui/react'
import { Avatar, SubscribeCard } from 'ui'
import {
  CommunityQRcodeStyle,
  TrackEvent,
  TrackKey,
  useAccount,
  useCopyWithStatus,
  useScreenshot,
  useTrackClick,
} from 'hooks'
import dayjs from 'dayjs'
import axios from 'axios'
import QrCode from 'qrcode.react'
import styled from '@emotion/styled'
import { useQuery } from 'react-query'
import { Trans, useTranslation } from 'react-i18next'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { ReactComponent as CopySvg } from 'assets/svg/copy.svg'
import { truncateAddress } from 'shared'
import { AddIcon, CheckIcon } from '@chakra-ui/icons'
import { Container } from '../components/Container'
import { ReactComponent as DownloadSvg } from '../assets/download.svg'
import BannerPng from '../assets/banner.png'
import { QueryKey } from '../api/QueryKey'
import { useAPI } from '../hooks/useAPI'
import { useSetUserInfo, useUserInfo } from '../hooks/useUserInfo'
import { useUpdateTipsPanel } from '../hooks/useUpdateTipsPanel'
import { APP_URL, HOME_URL } from '../constants/env/url'
import { MAIL_SERVER_URL } from '../constants/env/mailServer'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { TipsPanel } from '../components/TipsPanel'
import { FileUpload } from '../components/FileUpload'
import { useHomeAPI } from '../hooks/useHomeAPI'
import { useToast } from '../hooks/useToast'
import { UserSettingResponse } from '../api/modals/UserInfoResponse'

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

const SwitchWrap = styled(Switch)`
  .chakra-switch__track[data-checked] {
    background: #4e51f4;
  }
`

const verifyImageSize = (imgFile: File, width: number, height: number) =>
  new Promise((resolve) => {
    const img: HTMLImageElement = document.createElement('img')
    img.onload = () => {
      if (img.width >= width && img.height >= height) {
        resolve(true)
      } else {
        resolve(false)
      }
    }
    img.onerror = () => {
      resolve(false)
    }
    img.src = URL.createObjectURL(imgFile)
  })

export const Information: React.FC = () => {
  useDocumentTitle('Information')
  const { t } = useTranslation(['user_information', 'common'])
  const cardStyleProps = useStyleConfig('Card') as BoxProps
  const account = useAccount()
  const api = useAPI()
  const homeApi = useHomeAPI()
  const userInfo = useUserInfo()
  const setUserInfo = useSetUserInfo()
  const toast = useToast()

  const [bannerUrl, setBannerUrl] = useState(BannerPng)
  const [bannerUrlOnline, setBannerUrlOnline] = useState(BannerPng)
  const [description, setDescription] = useState('')
  const [itemsLink, setItemsLink] = useState('')
  const [mmbState, setMmbState] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [pubDisable, setPubDisable] = useState(true)
  const [isPublishing, setIsPublishing] = useState(false)

  const remoteSettingRef = useRef<UserSettingResponse | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const qrcodeRef = useRef<HTMLDivElement>(null)
  const onUpdateTipsPanel = useUpdateTipsPanel()
  const { downloadScreenshot } = useScreenshot()

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

  const { isLoading } = useQuery(
    ['userSetting', account],
    async () => {
      const res = await api.getUserSetting()
      return res.data
    },
    {
      refetchIntervalInBackground: false,
      refetchOnMount: true,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      onSuccess(d) {
        remoteSettingRef.current = d
        setBannerUrl(d.banner_url || BannerPng)
        setBannerUrlOnline(d.banner_url || BannerPng)
        setDescription(d.description)
        setItemsLink(d.items_link)
        setMmbState(d.mmb_state === 'enabled')
      },
    }
  )

  const trackClickInformationQRcodeDownload = useTrackClick(
    TrackEvent.CommunityClickInformationQRcodeDownload
  )

  const { onCopy, isCopied } = useCopyWithStatus()
  const subscribePageUrl = `${HOME_URL}/s/${
    userInfo?.address.split('@')[0] || ''
  }`

  const hasBanner = bannerUrl !== BannerPng

  const requestBody = useMemo<UserSettingResponse>(
    () => ({
      banner_url: hasBanner ? bannerUrl : '',
      items_link: itemsLink,
      mmb_state: mmbState ? 'enabled' : 'disabled',
      description,
    }),
    [hasBanner, bannerUrl, itemsLink, mmbState, description]
  )

  useEffect(() => {
    if (
      (Object.keys(requestBody) as (keyof typeof requestBody)[]).some((key) => {
        if (!remoteSettingRef.current) return false
        const oldValue = remoteSettingRef.current[key]
        return requestBody[key] !== oldValue
      })
    ) {
      setPubDisable(false)
    } else {
      setPubDisable(true)
    }
  }, [requestBody, remoteSettingRef?.current])

  const onSubmit = async () => {
    try {
      setIsPublishing(true)
      await api.updateUserSetting(requestBody)
      remoteSettingRef.current = requestBody
      setBannerUrlOnline(bannerUrl)
      toast('Publish Successfully', {
        status: 'success',
        alertProps: { colorScheme: 'green' },
      })
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        toast(error.message, {
          status: 'error',
          alertProps: { colorScheme: 'red' },
        })
      }
    }
    setIsPublishing(false)
  }

  const onUploadHandle = async (files: FileList) => {
    const MAX_FILE_SIZE = 5

    if (files.length) {
      setIsUploading(true)
      try {
        const file = files[0]
        const isErrorSize = await verifyImageSize(file, 2440, 400)
        if (!isErrorSize) {
          throw new Error('pixels')
        }
        const fsMb = file.size / (1024 * 1024)
        if (fsMb > MAX_FILE_SIZE) {
          throw new Error('exceed')
        }
        const { data } = await homeApi.uploadImage(file)
        setBannerUrl(data.url)
      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          toast(error.message, {
            status: 'error',
            alertProps: { colorScheme: 'red' },
          })
        } else {
          toast(
            <Trans
              t={t}
              i18nKey={error.message}
              components={{
                span: <Box as="span" color="#FF6B00" />,
              }}
            />,
            {
              status: 'error',
              alertProps: { colorScheme: 'red' },
            }
          )
        }
      }
      setIsUploading(false)
    }
  }

  useEffect(() => {
    onUpdateTipsPanel(
      <Trans
        i18nKey="help_qr_code"
        t={t}
        components={{
          h3: <Heading as="h3" fontSize="18px" mt="32px" mb="12px" />,
          p: <Text fontSize="14px" fontWeight="400" color="#737373;" />,
        }}
      />
    )
  }, [])

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
            onClick={onSubmit}
            isLoading={isPublishing}
            isDisabled={pubDisable}
          >
            {t('publish')}
          </Button>
        </Flex>
        <Tabs w="full" variant="normal" mt="38px">
          <TabList>
            <Tab>{t('tabs.Profile')}</Tab>
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
                    value={subscribePageUrl}
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
                      onClick={() => onCopy(subscribePageUrl)}
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
                bgImage={isLoading ? '' : bannerUrl}
                bgSize="100% auto"
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
                    <FileUpload
                      accept=".jpg, .jpeg, .gif, .png, .bmp"
                      onChange={onUploadHandle}
                    >
                      <Button
                        leftIcon={<AddIcon />}
                        variant="upload"
                        colorScheme="primaryButton"
                        loadingText="Uploading"
                        isLoading={isUploading}
                      >
                        {t('upload.button')}
                      </Button>
                    </FileUpload>

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
                        onClick={() => setBannerUrl(BannerPng)}
                      >
                        {t('upload.remove')}
                      </Button>
                    ) : null}
                  </Center>
                </Center>
              </Center>
              <Text mt="8px" fontWeight="400" fontSize="14px" lineHeight="20px">
                {t('upload.appear')}
              </Text>

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
                    <Flex justify="center" mb="16px" h="180px">
                      <Box w="112px" h="180px">
                        <Box
                          transform={`scale(${112 / 335})`}
                          transformOrigin="0 0"
                        >
                          <SubscribeCard
                            isPic
                            mailAddress={
                              userInfo?.address ||
                              `${account}@${MAIL_SERVER_URL}`
                            }
                            bannerUrl={bannerUrlOnline}
                            desc={description}
                            nickname={truncateAddress(
                              userInfo?.name ||
                                userInfoData?.name ||
                                userInfo?.address.split('@')[0] ||
                                '',
                              '_'
                            )}
                            qrUrl={subscribePageUrl}
                          />
                        </Box>
                      </Box>
                    </Flex>
                    <DownloadButton
                      mt="auto"
                      onClick={() => {
                        if (!cardRef.current) return
                        downloadScreenshot(
                          cardRef.current,
                          `profile_card_${account}.png`,
                          {
                            width: 335,
                            height: 535,
                            scale: 2,
                          }
                        )
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
                        value={subscribePageUrl}
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
                  value={itemsLink}
                  onChange={({ target: { value } }) => setItemsLink(value)}
                />
              </FormControl>
              <Text
                fontWeight="600"
                fontSize="12px"
                lineHeight="20px"
                p="5px 0"
              >
                <Trans
                  t={t}
                  i18nKey="appear"
                  components={{
                    span: <Box as="span" color="#FF6B00" />,
                  }}
                />
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
                        href="https://rank.cluster3.net"
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
                    <FormLabel>{t('description')}</FormLabel>
                    <Textarea
                      placeholder={t('description_placeholder')}
                      value={description}
                      onChange={({ target: { value } }) =>
                        setDescription(value)
                      }
                      maxLength={100}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Mail Me Button</FormLabel>
                    <Flex justifyContent="space-between" alignItems="center">
                      <Box fontWeight="500" fontSize="12px" lineHeight="15px">
                        {t('display_Mail_Me_Button')}
                      </Box>
                      <SwitchWrap
                        isChecked={mmbState}
                        onChange={({ target: { checked } }) =>
                          setMmbState(checked)
                        }
                      />
                    </Flex>
                  </FormControl>
                </VStack>
              </Flex>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
      <TipsPanel useSharedContent />
      <SubscribeCard
        // isDev
        mailAddress={userInfo?.address || `${account}@${MAIL_SERVER_URL}`}
        bannerUrl={bannerUrlOnline}
        desc={description}
        ref={cardRef}
        nickname={truncateAddress(
          userInfo?.name ||
            userInfoData?.name ||
            userInfo?.address.split('@')[0] ||
            '',
          '_'
        )}
        qrUrl={subscribePageUrl}
      />
    </Container>
  )
}
