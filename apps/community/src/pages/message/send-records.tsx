import {
  BoxProps,
  Flex,
  Grid,
  Heading,
  useStyleConfig,
  Box,
  VStack,
  Spinner,
  Icon,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { useInfiniteQuery } from 'react-query'
import { Fragment, useMemo } from 'react'
import dayjs from 'dayjs'
import { IpfsModal } from 'ui'
import { Container } from '../../components/Container'
import {
  NewMessageLinkButton,
  PureStyledNewMessageButton,
} from '../../components/NewMessageLinkButton'
import { SentRecordItem } from '../../components/SentRecordItem'
import { QueryKey } from '../../api/QueryKey'
import { useAPI } from '../../hooks/useAPI'
import { DEFAULT_LIST_ITEM_COUNT } from '../../constants/env/config'
import { useLoadNextPageRef } from '../../hooks/useLoadNextPageRef'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { ReactComponent as DownloadSvg } from '../../assets/DownloadIcon.svg'
import { useSwitchMirror } from '../../hooks/useSwitchMirror'

export const SendRecords: React.FC = () => {
  useDocumentTitle('Send Records')
  const { t } = useTranslation(['send_message', 'common'])
  const cardStyleProps = useStyleConfig('Card') as BoxProps
  const api = useAPI()

  const listQuery = useInfiniteQuery(
    [QueryKey.GetMessageList],
    async ({ pageParam }) =>
      api
        .getMessageList({
          cursor: pageParam,
          count: DEFAULT_LIST_ITEM_COUNT,
        })
        .then((r) => r.data),
    {
      getNextPageParam: (lastPage) =>
        !lastPage.next_cursor ? undefined : lastPage.next_cursor,
    }
  )

  const loadNextPageRef = useLoadNextPageRef(async (entries) => {
    if (listQuery.hasNextPage && !listQuery.isFetchingNextPage) {
      await Promise.all(
        entries
          .filter((e) => e.isIntersecting)
          .map(() => listQuery.fetchNextPage())
      )
    }
  })

  const lastMessageSentTime = useMemo(() => {
    const createdAt = listQuery?.data?.pages[0].messages?.[0]?.created_at
    if (!createdAt) return undefined
    const createdAtNumber = Number(createdAt)
    return createdAtNumber ? dayjs.unix(createdAtNumber) : undefined
  }, [listQuery?.data?.pages[0].messages])

  const loadingEl = (
    <Flex align="center" color="secondaryTitleColor" h="48px">
      <Spinner w="16px" h="16px" />
      <Box as="span" ml="4px" fontWeight="500" fontSize="16px">
        {t('loading', { ns: 'common' })}
      </Box>
    </Flex>
  )

  const {
    switchMirrorOnClick,
    isOpenIpfsModal,
    onCloseIpfsModal,
    isUploadedIpfsKey,
    isLoadingIsUploadedIpfsKeyState,
    switchMirror,
    isCheckAdminStatusLoading,
  } = useSwitchMirror()

  return (
    <Container
      as={Grid}
      gridTemplateColumns="100%"
      gridTemplateRows="132px auto"
      gap="20px"
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
      <Grid w="full" gridTemplateColumns="3fr 1fr" gap="20px">
        <Flex direction="column" p="16px" {...cardStyleProps}>
          <Heading as="h3" fontSize="16px">
            {t('new_message')}
          </Heading>
          <NewMessageLinkButton
            isLoading={listQuery.isLoading}
            lastMessageSentTime={lastMessageSentTime}
          />
        </Flex>
        <Flex
          direction="column"
          p="16px"
          color="primaryTitleColor"
          onClick={switchMirrorOnClick}
          {...cardStyleProps}
        >
          <Heading as="h3" fontSize="16px">
            {t('switch_from_mirror')}
          </Heading>
          <PureStyledNewMessageButton>
            {isLoadingIsUploadedIpfsKeyState || isCheckAdminStatusLoading ? (
              <Spinner w="24px" h="24px" mx="18px" />
            ) : (
              <Icon as={DownloadSvg} w="24px" h="24px" mx="18px" />
            )}
          </PureStyledNewMessageButton>
        </Flex>
      </Grid>
      <Box {...cardStyleProps} p="32px">
        <Heading as="h2" fontSize="18px" fontWeight="700">
          {t('title')}
        </Heading>
        <VStack spacing="4px" mt="24px" w="full">
          {listQuery.isLoading
            ? loadingEl
            : listQuery.data?.pages?.map((page, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <Fragment key={i}>
                  {page.messages?.map((message) => (
                    <Box key={message.uuid} h="48px" w="full">
                      <SentRecordItem
                        uuid={message.uuid}
                        time={dayjs.unix(Number(message.created_at))}
                        subject={message.subject}
                        viewCount={message.read_count}
                        messageType={message.message_type}
                      />
                    </Box>
                  ))}
                </Fragment>
              ))}
          <div ref={loadNextPageRef} />
          {listQuery.isFetchingNextPage ? loadingEl : null}
          {!listQuery.isLoading &&
          !listQuery.isFetchingNextPage &&
          !listQuery.hasNextPage ? (
            <Flex
              align="center"
              color="secondaryTitleColor"
              h="48px"
              fontWeight="500"
              fontSize="16px"
            >
              {t('all_loaded', { ns: 'common' })}
            </Flex>
          ) : null}
        </VStack>
      </Box>
    </Container>
  )
}
