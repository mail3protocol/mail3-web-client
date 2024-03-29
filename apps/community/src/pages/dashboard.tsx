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
} from '@chakra-ui/react'
import { ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'
import { useQuery } from 'react-query'
import dayjs from 'dayjs'
import { Avatar, IpfsModal } from 'ui'
import { Container } from '../components/Container'
import { ReactComponent as DownloadSvg } from '../assets/DownloadIcon.svg'
import { SentRecordItem } from '../components/SentRecordItem'
import { RoutePath } from '../route/path'
import { useAPI } from '../hooks/useAPI'
import { QueryKey } from '../api/QueryKey'
import { useDownloadSubscribers } from '../hooks/useDownloadSubscribers'
import { useToast } from '../hooks/useToast'
import { useUserInfo } from '../hooks/useUserInfo'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { formatUserName } from '../utils/string'
import { useOpenNewMessagePage } from '../hooks/useOpenNewMessagePage'
import { ReactComponent as OutlineAddIconSvg } from '../assets/OutlineAddIcon.svg'
import { useSwitchMirror } from '../hooks/useSwitchMirror'
import { APP_URL } from '../constants/env/url'

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
  const { t } = useTranslation(['dashboard', 'common', 'send_message'])
  const api = useAPI()
  const { data: statisticsData } = useQuery(
    [QueryKey.GetStatistics],
    async () => api.getStatistics().then((r) => r.data)
  )
  const { data: messageList, isLoading: isLoadingMessageList } = useQuery(
    [QueryKey.GetMessageListForDashboard],
    async () => api.getMessageList({ count: 10 }).then((r) => r.data)
  )
  const openNewMessagePage = useOpenNewMessagePage()
  const isShowMirror = false

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

  const {
    switchMirrorOnClick,
    isOpenIpfsModal,
    onCloseIpfsModal,
    isUploadedIpfsKey,
    isLoadingIsUploadedIpfsKeyState,
    switchMirror,
    isCheckAdminStatusLoading,
  } = useSwitchMirror()

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
            messageType={item.message_type}
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
        <Center
          flexDirection="column"
          as="a"
          href={`${APP_URL}/${
            userInfo?.manager_default_alias.split('@')[0] || ''
          }`}
          target="_blank"
          _hover={{
            textDecoration: 'underline',
          }}
        >
          <Avatar
            w="48px"
            h="48px"
            address={userInfo?.manager_default_alias || ''}
            borderRadius="50%"
          />

          <Text mt="4px" fontWeight="bold">
            {userInfo?.nickname ||
              formatUserName(userInfo?.manager_default_alias.split('@')[0])}
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
      <Grid
        w="full"
        h="full"
        rowGap="20px"
        css={{
          '.button': {
            width: '100%',
            height: '100%',
          },
          '.button:hover': {
            textDecoration: 'underline',
          },
          '.button:active': {
            opacity: 0.6,
            textDecoration: 'underline',
          },
        }}
      >
        <Box bg="cardBackground" shadow="card" rounded="card">
          <Flex
            as={RouterLink}
            align="center"
            justify={isShowMirror ? 'space-between' : 'center'}
            color="primary.900"
            flexDirection={isShowMirror ? 'row' : 'column-reverse'}
            pl={isShowMirror ? '40px' : '0'}
            to={RoutePath.NewMessage}
            target="_blank"
            onClick={openNewMessagePage.onClick}
            className="button"
          >
            <Heading
              as="h3"
              fontSize="16px"
              mt={isShowMirror ? '0' : '12px'}
              pl={isShowMirror ? '0' : '12px'}
            >
              {t('send_message')}
              <Tooltip
                label={t('send_rule', { ns: 'send_message' })}
                hasArrow
                placement="bottom"
                maxW="390px"
                w="390px"
                fontSize="12px"
              >
                <InfoOutlineIcon
                  color="primaryTextColor"
                  w="14px"
                  h="14px"
                  mb="2px"
                  ml="5px"
                />
              </Tooltip>
            </Heading>
            {openNewMessagePage.isLoading ? (
              <Spinner w="24px" h="24px" mx="18px" />
            ) : (
              <Icon as={OutlineAddIconSvg} w="24px" h="24px" mx="18px" />
            )}
          </Flex>
        </Box>
        {isShowMirror ? (
          <Box bg="cardBackground" shadow="card" rounded="card">
            <Flex
              as="button"
              pl="40px"
              align="center"
              justify="space-between"
              className="button"
              onClick={switchMirrorOnClick}
            >
              <Heading as="h3" fontSize="16px" whiteSpace="nowrap">
                {t('switch_from_mirror')}
              </Heading>
              {isLoadingIsUploadedIpfsKeyState || isCheckAdminStatusLoading ? (
                <Spinner w="24px" h="24px" mx="18px" />
              ) : (
                <Icon as={DownloadSvg} w="24px" h="24px" mx="18px" />
              )}
            </Flex>
          </Box>
        ) : null}
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
            to={RoutePath.Published}
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
