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
  Tooltip,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { useInfiniteQuery } from 'react-query'
import { Fragment } from 'react'
import dayjs from 'dayjs'
import { IpfsModal } from 'ui'
import { InfoOutlineIcon } from '@chakra-ui/icons'
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
  const isShowMirror = false

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

  const isEmpty = !listQuery.data?.pages[0].messages

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
      <Grid
        w="full"
        gridTemplateColumns={isShowMirror ? '3fr 1fr' : ''}
        gap="20px"
      >
        <Flex direction="column" p="16px" {...cardStyleProps}>
          <Heading as="h3" fontSize="16px">
            {t('new_message')}
            <Tooltip
              label={t('send_rule')}
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
          <NewMessageLinkButton isLoading={listQuery.isLoading} />
        </Flex>
        {isShowMirror ? (
          <Flex
            direction="column"
            p="16px"
            color="primaryTitleColor"
            cursor="pointer"
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
        ) : null}
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
          !listQuery.hasNextPage &&
          !isEmpty ? (
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
          {!listQuery.isFetchingNextPage && !listQuery.isLoading && isEmpty ? (
            <Flex
              align="center"
              color="secondaryTitleColor"
              h="48px"
              fontWeight="500"
              fontSize="16px"
            >
              {t('no_data', { ns: 'common' })}
            </Flex>
          ) : null}
        </VStack>
      </Box>
    </Container>
  )
}
