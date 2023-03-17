import {
  Box,
  BoxProps,
  Button,
  ButtonProps,
  Center,
  CenterProps,
  Flex,
  FormControl,
  Grid,
  Heading,
  HStack,
  Icon,
  Input,
  Link,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Textarea,
  useStyleConfig,
} from '@chakra-ui/react'
import { Avatar, SubscribeCard } from 'ui'
import {
  CommunityQRcodeStyle,
  TrackEvent,
  TrackKey,
  useAccount,
  useScreenshot,
  useTrackClick,
} from 'hooks'
import axios from 'axios'
import QrCode from 'qrcode.react'
import styled from '@emotion/styled'
import { useQuery } from 'react-query'
import { Trans, useTranslation } from 'react-i18next'
import React, { useEffect, useMemo, useRef, useState } from 'react'

import {
  isInvalidNickname,
  isPrimitiveEthAddress,
  truncateAddress,
} from 'shared'
import { AddIcon } from '@chakra-ui/icons'
import { useUpdateAtom } from 'jotai/utils'
import { avatarsAtom, DEFAULT_AVATAR_SRC } from 'ui/src/Avatar'
import { Container } from '../components/Container'
import { ReactComponent as DownloadSvg } from '../assets/DownloadIcon.svg'
import BannerPng from '../assets/banner.png'
import { QueryKey } from '../api/QueryKey'
import { useAPI } from '../hooks/useAPI'
import { useSetUserInfo } from '../hooks/useUserInfo'
import { useUpdateTipsPanel } from '../hooks/useUpdateTipsPanel'
import { APP_URL } from '../constants/env/url'
import { MAIL_SERVER_URL } from '../constants/env/mailServer'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { TipsPanel } from '../components/TipsPanel'
import { FileUpload } from '../components/FileUpload'
import { useHomeAPI } from '../hooks/useHomeAPI'
import { useToast } from '../hooks/useToast'
import { UserSettingRequest } from '../api/modals/UserInfoResponse'
import { UploadImageType } from '../api/HomeAPI'

const DESCRIPTION_MAX_LENGTH = 1000

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

const ButtonGroup: React.FC<
  CenterProps & {
    hasRemove: boolean
    isUploading: boolean
    removeButtonColor?: string
    onUpload: (files: FileList) => Promise<void>
    onRemove: () => void
  }
> = ({
  hasRemove,
  isUploading,
  onUpload,
  onRemove,
  removeButtonColor = '#fff',
  ...props
}) => {
  const { t } = useTranslation(['user_information', 'common'])
  return (
    <Center {...props}>
      <FileUpload accept=".jpg, .jpeg, .gif, .png, .bmp" onChange={onUpload}>
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

      {hasRemove ? (
        <Button
          variant="ghost"
          ml="5px"
          color={removeButtonColor}
          fontSize="12px"
          fontWeight="600"
          lineHeight="14px"
          height="28px"
          _active={{ bg: 'transparent' }}
          _hover={{ bg: 'transparent' }}
          onClick={onRemove}
        >
          {t('upload.remove')}
        </Button>
      ) : null}
    </Center>
  )
}

export const Information: React.FC = () => {
  useDocumentTitle('Information')
  const { t } = useTranslation(['user_information', 'common'])
  const cardStyleProps = useStyleConfig('Card') as BoxProps
  const account = useAccount()
  const api = useAPI()
  const homeApi = useHomeAPI()
  const setUserInfo = useSetUserInfo()
  const toast = useToast()

  const [bannerUrl, setBannerUrl] = useState(BannerPng)
  const [bannerUrlOnline, setBannerUrlOnline] = useState(BannerPng)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [itemsLink, setItemsLink] = useState('')
  const [mmbState, setMmbState] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [pubDisable, setPubDisable] = useState(true)
  const [isPublishing, setIsPublishing] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(DEFAULT_AVATAR_SRC)
  const setAvatars = useUpdateAtom(avatarsAtom)

  const remoteSettingRef = useRef<UserSettingRequest | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const qrcodeRef = useRef<HTMLDivElement>(null)
  const onUpdateTipsPanel = useUpdateTipsPanel()
  const { downloadScreenshot } = useScreenshot()
  const {
    data: userInfo,
    isLoading,
    refetch,
  } = useQuery(
    [QueryKey.GetUserSetting, account],
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
        setUserInfo(d)
        remoteSettingRef.current = d
        setBannerUrl(d.banner_url || BannerPng)
        setBannerUrlOnline(d.banner_url || BannerPng)
        setDescription(d.description)
        setItemsLink(d.items_link)
        setMmbState(d.mmb_state === 'enabled')
        setAvatarUrl(d.avatar)

        if (d.nickname) {
          setName(d.nickname)
          return
        }

        const defaultAlias = d.manager_default_alias.split('@')[0] || ''
        let defaultName = defaultAlias
        if (isPrimitiveEthAddress(defaultAlias)) {
          defaultName = truncateAddress(defaultAlias || '', '_')
        }
        setName(defaultName)
      },
    }
  )

  const trackClickInformationQRcodeDownload = useTrackClick(
    TrackEvent.CommunityClickInformationQRcodeDownload
  )
  const alias = userInfo?.manager_default_alias.split('@')[0] || ''
  const subscribePageUrl = `${APP_URL}/${alias}`
  const hasBanner = bannerUrl !== BannerPng

  const requestBody = useMemo<UserSettingRequest>(
    () => ({
      banner_url: hasBanner ? bannerUrl : '',
      items_link: itemsLink,
      mmb_state: mmbState ? 'enabled' : 'disabled',
      description,
      nickname: name,
      avatar: avatarUrl,
    }),
    [hasBanner, bannerUrl, itemsLink, mmbState, description, name, avatarUrl]
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
      if (isInvalidNickname(name)) {
        toast('Invalid publication name', {
          status: 'warning',
        })
        return
      }
      setIsPublishing(true)
      await api.updateUserSetting(requestBody)
      remoteSettingRef.current = requestBody
      setBannerUrlOnline(bannerUrl)
      setAvatars((prev) => ({
        ...prev,
        [alias]: avatarUrl,
      }))
      refetch()
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

  const onUploadAvatarHandle = async (files: FileList) => {
    const MAX_FILE_SIZE = 2

    if (files.length) {
      setIsUploadingAvatar(true)
      try {
        const file = files[0]
        const fsMb = file.size / (1024 * 1024)
        if (fsMb > MAX_FILE_SIZE) {
          throw new Error('avatar_exceed')
        }
        const { data } = await homeApi.uploadAvatar(file)
        setAvatarUrl(data.url)
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
      setIsUploadingAvatar(false)
    }
  }

  const onUploadBannerHandle = async (files: FileList) => {
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
        const { data } = await homeApi.uploadImage(file, {
          type: UploadImageType.Banner,
        })
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
            {t('save')}
          </Button>
        </Flex>
        <Tabs w="full" variant="normal" mt="38px">
          <TabList>
            <Tab>{t('tabs.Profile')}</Tab>
            <Tab>{t('tabs.Items')}</Tab>
          </TabList>

          <TabPanels>
            <TabPanel p="32px 0">
              <FormControl>
                <Title>{t('name_field')}</Title>
                <Input
                  maxLength={16}
                  placeholder={t('name_placeholder')}
                  name="name"
                  value={name}
                  onChange={({ target: { value } }) => setName(value)}
                />
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
                      address=""
                      src={avatarUrl}
                      w="80px"
                      h="80px"
                      borderRadius="50%"
                    />
                  </Center>
                </Center>
                <Box>
                  <Box
                    fontWeight="500"
                    fontSize="12px"
                    lineHeight="16px"
                    color="secondaryTitleColor"
                    w="280px"
                  >
                    {t('avatar_format')}
                  </Box>

                  <ButtonGroup
                    mt="16px"
                    justifyContent="flex-start"
                    removeButtonColor="secondaryTextColor"
                    onUpload={onUploadAvatarHandle}
                    isUploading={isUploadingAvatar}
                    hasRemove={!!avatarUrl && avatarUrl !== DEFAULT_AVATAR_SRC}
                    onRemove={() => setAvatarUrl(DEFAULT_AVATAR_SRC)}
                  />
                </Box>
              </HStack>

              <FormControl>
                <Title>{t('description')}</Title>
                <Textarea
                  h="188px"
                  variant="black"
                  placeholder={t('description_placeholder')}
                  value={description}
                  onChange={({ target: { value } }) => setDescription(value)}
                  maxLength={DESCRIPTION_MAX_LENGTH}
                />
                <Box
                  whiteSpace="nowrap"
                  fontSize="12px"
                  color="#92929D"
                  position="absolute"
                  bottom="8px"
                  right="16px"
                  zIndex={99}
                >
                  {description.length} / {DESCRIPTION_MAX_LENGTH}
                </Box>
              </FormControl>

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
                overflow="hidden"
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
                  <ButtonGroup
                    mt="5px"
                    isUploading={isUploading}
                    hasRemove={hasBanner}
                    onUpload={onUploadBannerHandle}
                    onRemove={() => {
                      setBannerUrl(BannerPng)
                    }}
                  />
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
                      <Box w="130px" h="180px">
                        <Box
                          transform={`scale(${130 / 1005})`}
                          transformOrigin="0 0"
                        >
                          <SubscribeCard
                            isPic
                            mailAddress={
                              userInfo?.manager_default_alias ||
                              `${account}@${MAIL_SERVER_URL}`
                            }
                            bannerUrl={bannerUrlOnline}
                            desc={description || t('description_placeholder')}
                            nickname={name}
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
                            width: 1005,
                            height: cardRef.current.offsetHeight,
                            scale: 1,
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
          </TabPanels>
        </Tabs>
      </Flex>
      <TipsPanel useSharedContent />
      <SubscribeCard
        // isDev
        mailAddress={
          userInfo?.manager_default_alias || `${account}@${MAIL_SERVER_URL}`
        }
        bannerUrl={bannerUrlOnline}
        desc={description || t('description_placeholder')}
        ref={cardRef}
        nickname={name}
        qrUrl={subscribePageUrl}
      />
    </Container>
  )
}
