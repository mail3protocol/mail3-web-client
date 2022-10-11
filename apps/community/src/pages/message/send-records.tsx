import {
  BoxProps,
  Flex,
  Grid,
  Heading,
  useStyleConfig,
  Box,
  VStack,
  Skeleton,
  Spinner,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { useInfiniteQuery } from 'react-query'
import { Fragment } from 'react'
import { Container } from '../../components/Container'
import { NewMessageLinkButton } from '../../components/NewMessageLinkButton'
import { SentRecordItem } from '../../components/SentRecordItem'
import { QueryKey } from '../../api/QueryKey'
import { useAPI } from '../../hooks/useAPI'
import { DEFAULT_LIST_ITEM_COUNT } from '../../constants/env/config'
import { useLoadNextPageRef } from '../../hooks/useLoadNextPageRef'

export const SendRecords: React.FC = () => {
  const { t } = useTranslation(['send_message', 'common'])
  const cardStyleProps = useStyleConfig('Card') as BoxProps
  const api = useAPI()

  const listQuery = useInfiniteQuery(
    [QueryKey.GetMessageList],
    async ({ pageParam = '0' }) =>
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

  return (
    <Container
      as={Grid}
      gridTemplateColumns="100%"
      gridTemplateRows="132px auto"
      gap="20px"
    >
      <Flex direction="column" p="16px" {...cardStyleProps}>
        <Heading as="h3" fontSize="16px">
          {t('new_message')}
        </Heading>
        <NewMessageLinkButton />
      </Flex>
      <Box {...cardStyleProps} p="32px">
        <Heading as="h2" fontSize="18px" fontWeight="700">
          {t('title')}
        </Heading>
        <VStack spacing="0" mt="24px" w="full">
          {listQuery.isLoading ? (
            <>
              {new Array(10)
                .fill(0)
                .map((_, i) => i)
                .map((i) => (
                  <Skeleton h="52px" w="full" key={i} />
                ))}
            </>
          ) : (
            listQuery.data?.pages?.map((page, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <Fragment key={i}>
                {page.messages?.map((message) => (
                  <Box key={message.uuid} h="52px" w="full">
                    <SentRecordItem
                      time={message.created_at}
                      subject={message.subject}
                      viewCount={message.read_count}
                    />
                  </Box>
                ))}
              </Fragment>
            ))
          )}
          <div ref={loadNextPageRef} />
          {listQuery.isFetchingNextPage ? (
            <Flex align="center" color="secondaryTitleColor" h="52px">
              <Spinner w="16px" h="16px" />
              <Box as="span" ml="4px" fontWeight="500" fontSize="16px">
                {t('loading', { ns: 'common' })}
              </Box>
            </Flex>
          ) : null}
          {!listQuery.isLoading &&
          !listQuery.isFetchingNextPage &&
          !listQuery.hasNextPage ? (
            <Flex
              align="center"
              color="secondaryTitleColor"
              h="52px"
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
