import { InfoOutlineIcon, QuestionOutlineIcon } from '@chakra-ui/icons'
import {
  Box,
  Grid,
  Center,
  Text,
  Flex,
  Heading,
  Tooltip,
  Link,
  List,
  ListItem,
  Icon,
  Spinner,
  useDisclosure,
  useToast as useChakraToast,
  HStack,
} from '@chakra-ui/react'
import { ReactNode, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'
import { useQuery } from 'react-query'
import dayjs from 'dayjs'
import { useDialog } from 'hooks'
import { Avatar, IpfsModal } from 'ui'
import axios from 'axios'
import { Container } from '../components/Container'
import { ReactComponent as DownloadSvg } from '../assets/DownloadIcon.svg'
import { ReactComponent as SyncSvg } from '../assets/SyncIcon.svg'
import { SentRecordItem } from '../components/SentRecordItem'
import { RoutePath } from '../route/path'
import { useAPI } from '../hooks/useAPI'
import { QueryKey } from '../api/QueryKey'
import { useDownloadSubscribers } from '../hooks/useDownloadSubscribers'
import { useToast } from '../hooks/useToast'
import { useSetUserInfo, useUserInfo } from '../hooks/useUserInfo'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { formatUserName } from '../utils/string'
import { useOpenNewMessagePage } from '../hooks/useOpenNewMessagePage'
import { ReactComponent as OutlineAddIconSvg } from '../assets/OutlineAddIcon.svg'
import { useCheckAdminStatus, useIsAdmin } from '../hooks/useAdmin'

interface BaseInfo {
  key: string
  field: ReactNode
  value: ReactNode
}

export const DownloadButton = () => {
  useDocumentTitle('Home')
  const onDownloadSubscribers = useDownloadSubscribers()
  const [isLoading, setIsLoading] = useState(false)
  const { t } = useTranslation(['dashboard', 'common'])
  const toast = useToast()

  return (
    <Link
      onClick={async () => {
        if (isLoading) return
        setIsLoading(true)
        try {
          const subscribers = await onDownloadSubscribers()
          if (subscribers.length <= 0) {
            toast(t('download_no_data'))
          }
        } catch (err) {
          toast(
            t('download_failed', {
              message:
                (err as any)?.message || t('unknown_error', { ns: 'common' }),
            })
          )
        } finally {
          setIsLoading(false)
        }
      }}
    >
      {isLoading ? (
        <Spinner ml="5px" w="16px" h="16px" color="primaryTextColor" />
      ) : (
        <Icon
          as={DownloadSvg}
          color="primaryTextColor"
          w="16px"
          h="16px"
          ml="5px"
        />
      )}
    </Link>
  )
}

export const Dashboard: React.FC = () => {
  const { t } = useTranslation(['dashboard', 'common'])
  const api = useAPI()
  const { data: statisticsData } = useQuery(
    [QueryKey.GetStatistics],
    async () => api.getStatistics().then((r) => r.data)
  )
  const { data: messageList, isLoading: isLoadingMessageList } = useQuery(
    [QueryKey.GetMessageListForDashboard],
    async () => api.getMessageList({ count: 10 }).then((r) => r.data)
  )
  const openNewMessagePage = useOpenNewMessagePage({
    isLoading: isLoadingMessageList,
    lastMessageSentTime: messageList?.messages?.[0]?.created_at
      ? dayjs.unix(Number(messageList.messages[0].created_at))
      : undefined,
  })

  const { isLoading: isCheckAdminStatusLoading } = useCheckAdminStatus()

  const dialog = useDialog()
  const baseInfos: BaseInfo[] = [
    {
      key: 'message',
      field: t('message'),
      value: statisticsData?.messages_count ?? '-',
    },
    {
      key: 'subscribers',
      field: (
        <>
          {t('subscribers')}
          <DownloadButton />
        </>
      ),
      value: statisticsData?.subscribers_count ?? '-',
    },
    {
      key: 'new_subscribers',
      field: (
        <>
          {t('new_subscribers')}
          <Tooltip label={t('statistics_time')} hasArrow placement="top">
            <InfoOutlineIcon
              color="primaryTextColor"
              w="14px"
              h="14px"
              mb="2px"
              ml="5px"
            />
          </Tooltip>
        </>
      ),
      value: statisticsData?.new_subscribers_count ?? '-',
    },
  ]
  const userInfo = useUserInfo()
  const setUserInfo = useSetUserInfo()
  useEffect(() => {
    if (
      !userInfo ||
      !userInfo.next_refresh_time ||
      dayjs(userInfo.next_refresh_time).isBefore(dayjs())
    ) {
      api.getUserInfo().then(({ data }) =>
        setUserInfo({
          ...data,
          next_refresh_time: dayjs().add(1, 'day').format(),
        })
      )
    }
  }, [userInfo?.next_refresh_time])

  const rawToast = useChakraToast()
  const toast = useToast()

  const {
    isOpen: isOpenIpfsModal,
    onOpen: onOpenIpfsModal,
    onClose: onCloseIpfsModal,
  } = useDisclosure()

  const isAdmin = useIsAdmin()

  const {
    data: isUploadedIpfsKey,
    isLoading: isLoadingIsUploadedIpfsKeyState,
  } = useQuery([QueryKey.GetMessageEncryptionKeyState], () =>
    api.getMessageEncryptionKeyState().then((res) => res.data.state === 'set')
  )

  const switchMirrorOnProgress = () => {
    rawToast.closeAll()
    rawToast({
      duration: 3000,
      position: 'top',
      render() {
        return (
          <HStack
            spacing="12px"
            padding="12px 16px"
            borderRadius="20px"
            bg="white"
            boxShadow="0px 0px 10px 4px rgb(25 25 100 / 10%)"
          >
            <Box>
              <SyncSvg style={{ position: 'relative', top: '-10px' }} />
            </Box>
            <Flex direction="column">
              <Text fontWeight="bold" fontSize="16px">
                {t('mirror.importing')}
              </Text>
              <Text fontSize="14px">{t('mirror.toast')}</Text>
            </Flex>
          </HStack>
        )
      },
    })
  }

  const switchMirror = async () => {
    try {
      await api.switchFromMirror()
      switchMirrorOnProgress()
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (
          error?.response?.data?.reason === 'COMMUNITY_POST_SYNC_EVENT_OCCUPIED'
        ) {
          switchMirrorOnProgress()
        } else if (error?.response?.status === 404) {
          toast(t('mirror.not_found'))
        } else {
          toast(error?.response?.data?.message || error?.message)
        }
      }
    }
  }

  const switchMirrorOnClick = () => {
    if (isLoadingIsUploadedIpfsKeyState || isCheckAdminStatusLoading) {
      return
    }
    if (isAdmin) {
      toast(t('mirror.not_allow'))
      return
    }
    dialog({
      title: t('switch_from_mirror'),
      description: (
        <>
          <Text fontWeight={600}>{t('mirror.sub_title')}</Text>
          <Text color="#4E51F4" mt="24px" fontWeight={400} fontSize="15px">
            {t('mirror.desc')}
          </Text>
        </>
      ),
      okText: t('mirror.import'),
      async onConfirm() {
        if (!isUploadedIpfsKey) {
          onOpenIpfsModal()
        } else {
          await switchMirror()
        }
      },
    })
  }

  const listEl =
    !messageList?.messages || messageList?.messages.length <= 0 ? (
      <ListItem
        textAlign="center"
        color="secondaryTitleColor"
        fontSize="16px"
        fontWeight="500"
        lineHeight="50px"
      >
        {t('no_data', { ns: 'common' })}
      </ListItem>
    ) : (
      (messageList?.messages || []).map((item) => (
        <ListItem h="52px" key={item.uuid}>
          <SentRecordItem
            uuid={item.uuid}
            time={dayjs.unix(Number(item.created_at))}
            subject={item.subject}
            viewCount={item.read_count}
          />
        </ListItem>
      ))
    )

  return (
    <Container
      as={Grid}
      gap="20px"
      gridTemplateColumns="3fr 1fr"
      gridTemplateRows="132px 1fr"
    >
      {!isLoadingIsUploadedIpfsKeyState ? (
        <IpfsModal
          isContent
          isOpen={isOpenIpfsModal}
          onClose={onCloseIpfsModal}
          isForceConnectWallet={!isUploadedIpfsKey}
          onAfterSignature={async (_, key) => {
            await api.updateMessageEncryptionKey(key)
            onCloseIpfsModal()
            await switchMirror()
          }}
        />
      ) : null}
      <Grid
        bg="cardBackground"
        shadow="card"
        rounded="card"
        fontSize="14px"
        gridTemplateColumns="repeat(4, 1fr)"
        gridTemplateRows="1fr"
        h="full"
      >
        <Center flexDirection="column">
          <Avatar
            w="48px"
            h="48px"
            address={userInfo?.address.split('@')[0] || ''}
            borderRadius="50%"
          />
          <Text mt="4px" fontWeight="bold">
            {formatUserName(userInfo?.name)}
          </Text>
        </Center>
        {baseInfos.map((info) => (
          <Flex
            key={info.key}
            direction="column"
            align="flex-start"
            justifyContent="center"
          >
            <Heading as="h4" fontSize="14px" color="secondaryTitleColor">
              {info.field}
            </Heading>
            <Text fontSize="16px" fontWeight="600" mt="4px">
              {typeof info.value === 'number'
                ? info.value.toLocaleString('en-US')
                : info.value}
            </Text>
          </Flex>
        ))}
      </Grid>
      <Grid w="full" h="full" rowGap="20px">
        <Flex
          as={RouterLink}
          bg="cardBackground"
          shadow="card"
          rounded="card"
          align="center"
          justify="space-between"
          color="primary.900"
          pl="40px"
          to={RoutePath.NewMessage}
          target="_blank"
          onClick={openNewMessagePage.onClick}
        >
          <Heading as="h3" fontSize="16px">
            {t('send_message')}
          </Heading>
          {openNewMessagePage.isLoading ? (
            <Spinner w="24px" h="24px" mx="18px" />
          ) : (
            <Icon as={OutlineAddIconSvg} w="24px" h="24px" mx="18px" />
          )}
        </Flex>
        <Flex
          as="button"
          bg="cardBackground"
          shadow="card"
          rounded="card"
          pl="40px"
          align="center"
          justify="space-between"
          onClick={switchMirrorOnClick}
        >
          <Heading as="h3" fontSize="16px">
            {t('switch_from_mirror')}
          </Heading>
          {isLoadingIsUploadedIpfsKeyState || isCheckAdminStatusLoading ? (
            <Spinner w="24px" h="24px" mx="18px" />
          ) : (
            <Icon as={DownloadSvg} w="24px" h="24px" mx="18px" />
          )}
        </Flex>
      </Grid>
      <Box
        bg="cardBackground"
        shadow="card"
        rounded="card"
        gridColumn="1 / 3"
        p="32px"
      >
        <Flex justify="space-between" align="flex-end">
          <Heading as="h2" fontSize="18px" fontWeight="700">
            {t('send_records')}
            <Tooltip label={t('send_records_tooltip')} hasArrow placement="top">
              <QuestionOutlineIcon ml="4px" mb="3px" w="16px" h="16px" />
            </Tooltip>
          </Heading>
          <Link
            as={RouterLink}
            to={RoutePath.SendRecords}
            color="primary.900"
            fontSize="12px"
            textDecoration="underline"
            fontWeight="500"
            textDecorationLine="none"
          >
            {t('view_all_send_records')}
          </Link>
        </Flex>
        <List mt="24px">
          {isLoadingMessageList ? (
            <Flex
              align="center"
              color="secondaryTitleColor"
              h="48px"
              justify="center"
              w="full"
            >
              <Spinner w="16px" h="16px" />
              <Box as="span" ml="4px" fontWeight="500" fontSize="16px">
                {t('loading', { ns: 'common' })}
              </Box>
            </Flex>
          ) : (
            listEl
          )}
        </List>
      </Box>
    </Container>
  )
}
