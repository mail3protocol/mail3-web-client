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
  Icon,
  Image,
  Input,
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
import { Trans, useTranslation } from 'react-i18next'
import QrCode from 'qrcode.react'
import React, { useMemo, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import dayjs from 'dayjs'
import { ReactComponent as SvgRank } from 'assets/svg/rank.svg'
import { ReactComponent as SvgCollect } from 'assets/svg/collect.svg'
import axios from 'axios'
import { ClusterInfoResp } from 'models'
import { ReactComponent as CopySvg } from 'assets/svg/copy.svg'
import { CheckIcon } from '@chakra-ui/icons'
import { truncateAddress } from 'shared'
import { Container } from '../components/Container'
import { ReactComponent as DownloadSvg } from '../assets/download.svg'
import { QueryKey } from '../api/QueryKey'
import { useAPI } from '../hooks/useAPI'
import { useSetUserInfo, useUserInfo } from '../hooks/useUserInfo'
import { APP_URL, HOME_URL } from '../constants/env/url'
import { MAIL_SERVER_URL } from '../constants/env/mailServer'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

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

  return (
    <Container as={Grid} gridTemplateRows="100%" gap="20px">
      <Flex
        direction="column"
        align="center"
        {...cardStyleProps}
        w="full"
        h="full"
        p="32px"
      >
        <Heading fontSize="18px" lineHeight="20px" w="full">
          {t('title')}
        </Heading>
        <Center
          w="72px"
          h="72px"
          p="1.5px"
          bg="informationAvatarBackground"
          rounded="full"
          mt="32px"
        >
          <Avatar
            address={userInfo?.address.split('@')[0] || ''}
            w="68.5px"
            h="68.5px"
            borderRadius="50%"
          />
        </Center>
        <VStack as="form" spacing="24px" mt="32px" w="400px" mx="auto">
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
                label={t(isCopied ? 'copied' : 'copy', { ns: 'common' })}
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
            <FormLabel>{t('qr_code')}</FormLabel>
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
                          Collection Rank
                        </Box>
                        <Box mt="3px">{nftInfo?.ranking}</Box>
                      </Box>
                      <Box>
                        <Center mt="-7px">
                          <SvgCollect />
                        </Center>
                        <Center p="3px" mt="-5px">
                          Colleced
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
                          / <Box ml="2px">{nftInfo?.poapList.length ?? 0}</Box>
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
        </VStack>
      </Flex>
    </Container>
  )
}
