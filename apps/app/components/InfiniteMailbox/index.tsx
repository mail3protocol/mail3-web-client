import React, {
  useState,
  useEffect,
  useMemo,
  CSSProperties,
  forwardRef,
  useImperativeHandle,
  ForwardRefRenderFunction,
} from 'react'
import {
  useInfiniteQuery,
  QueryFunction,
  UseInfiniteQueryOptions,
  QueryKey,
  InfiniteData,
} from 'react-query'
import { Box } from '@chakra-ui/react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { LinkProps } from 'next/link'
import { MailboxesMessagesResponse } from '../../api'
import { BoxListProps, Mailbox, MessageItem } from '../Mailbox'
import { Mailboxes } from '../../api/mailboxes'

interface InfiniteMailboxProps<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
> {
  queryKey: TQueryKey
  queryFn: QueryFunction<TQueryFnData, TQueryKey>
  queryOptions?: UseInfiniteQueryOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryFnData,
    TQueryKey
  >
  emptyElement?: React.ReactNode
  noMoreElement: React.ReactNode
  loader?: React.ReactNode
  enableQuery?: boolean
  style?: CSSProperties
  parentIsChooseMode?: boolean
  parentChooseMap?: Record<string, boolean>
  calcDataLength?: (data?: InfiniteData<TData>) => number
  onDataChange?: (data: MessageItem[]) => void
  onGetIsFetching?: (isFetching: boolean) => void
  onGetIsLoading?: (isLoading: boolean) => void
  onChooseModeChange?: (bool: boolean) => void
  onClickBody?: BoxListProps['onClickBody']
  getHref: (id: string) => LinkProps['href']
  mailboxType?: Mailboxes
}

export interface InfiniteHandle {
  getChooseIds: () => string[]
  setHiddenIds: (ids: string[]) => void
}

const InfiniteBox: ForwardRefRenderFunction<
  InfiniteHandle,
  InfiniteMailboxProps<MailboxesMessagesResponse>
> = (
  {
    enableQuery,
    queryFn,
    queryKey,
    queryOptions,
    emptyElement,
    noMoreElement,
    loader,
    parentChooseMap = {},
    parentIsChooseMode = false,
    onDataChange,
    onGetIsLoading,
    onGetIsFetching,
    onChooseModeChange,
    onClickBody,
    getHref,
    mailboxType,
  },
  forwardedRef
) => {
  const queryData = useInfiniteQuery(queryKey, queryFn, {
    getNextPageParam: (lastPage) => {
      if (typeof lastPage?.page !== 'number') return undefined
      if (lastPage.page >= lastPage.pages - 1) {
        return undefined
      }
      return lastPage.page + 1
    },
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    cacheTime: Infinity,
    ...queryOptions,
    enabled: enableQuery,
  })

  const { data, status, hasNextPage, fetchNextPage, isFetching, isLoading } =
    queryData

  const [isChooseMode, setIsChooseMode] = useState(false)
  const [chooseMap, setChooseMap] = useState<Record<string, boolean>>({})
  const [hiddenMap, setHiddenMap] = useState<Record<string, boolean>>({})

  const loaderEl = useMemo(() => loader || <Box>Loading</Box>, [loader])

  const dataMsg: MessageItem[] = useMemo(() => {
    if (!data) return []
    const dataList = data.pages.map((item: any) => item.messages)
    return dataList.flat()
  }, [data])

  useEffect(() => {
    onGetIsFetching?.(isFetching)
  }, [isFetching])

  useEffect(() => {
    onGetIsLoading?.(isLoading)
  }, [isLoading])

  useEffect(() => {
    if (queryData.status === 'success') {
      onDataChange?.(dataMsg)
    }
  }, [dataMsg, queryData.status])

  useEffect(() => {
    onChooseModeChange?.(isChooseMode)
  }, [isChooseMode])

  useEffect(() => {
    setIsChooseMode(parentIsChooseMode)
  }, [parentIsChooseMode])

  useEffect(() => {
    let parentNoChoose = true
    if (Object.values(parentChooseMap).length) {
      parentNoChoose = Object.values(parentChooseMap).every((e) => !e)
    }
    if (Object.values(chooseMap).every((e) => !e) && parentNoChoose) {
      setIsChooseMode(false)
    }
  }, [chooseMap, parentChooseMap])

  useImperativeHandle(forwardedRef, () => ({
    getChooseIds() {
      return Object.keys(chooseMap).filter((key) => chooseMap[key])
    },
    setHiddenIds(ids) {
      const map: Record<string, boolean> = {}
      ids.forEach((key) => {
        map[key] = true
      })
      setHiddenMap({
        ...hiddenMap,
        ...map,
      })
      setChooseMap({})
      setIsChooseMode(false)
    },
  }))

  const dataLength = dataMsg.length
  const isEmpty = status === 'success' && dataLength === 0
  const endMessage = isEmpty ? '' : noMoreElement

  return (
    <Box>
      {data === undefined && status === 'loading' ? (
        loaderEl
      ) : (
        <InfiniteScroll
          dataLength={dataLength}
          next={fetchNextPage}
          hasMore={hasNextPage === true}
          loader={loaderEl}
          endMessage={endMessage}
          style={{ overflow: 'hidden' }}
        >
          <Mailbox
            data={dataMsg}
            isChooseMode={isChooseMode}
            setIsChooseMode={setIsChooseMode}
            chooseMap={chooseMap}
            hiddenMap={hiddenMap}
            onClickAvatar={(_i, id) => {
              const newMap = { ...chooseMap }
              newMap[id] = !newMap[id]
              setChooseMap(newMap)
            }}
            onClickBody={(id) => {
              if (!onClickBody) return
              onClickBody(id)
            }}
            getHref={getHref}
            mailboxType={mailboxType}
          />
          {isEmpty ? emptyElement ?? 'empty' : null}
        </InfiniteScroll>
      )}
    </Box>
  )
}

export const InfiniteMailbox = forwardRef(InfiniteBox)
