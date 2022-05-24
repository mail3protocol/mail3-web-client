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

import { Avatar } from 'ui'
import { AvatarBadge, Box, Circle, Flex, Text } from '@chakra-ui/react'
import styled from '@emotion/styled'
import { CheckIcon, CloseIcon } from '@chakra-ui/icons'
import InfiniteScroll from 'react-infinite-scroll-component'
import ChooseSVG from '../../assets/choose.svg'
import {
  AddressListResponse,
  AddressResponse,
  MailboxesMessagesResponse,
  MessageItemResponse,
} from '../../api'
import { dynamicDateString } from '../../utils'

export enum AvatarBadgeType {
  None,
  New,
  SentOK,
  SentFail,
}

export enum ItemType {
  None,
  Fail,
}

export interface MessageItem extends MessageItemResponse {
  // ui need state
  isChoose: boolean
  avatarBadgeType: AvatarBadgeType
  itemType: ItemType
}

export interface BoxListProps {
  data: Array<MessageItem>
  onClickAvatar?: (index: number, id?: string) => void
  onClickBody: (id: string) => void
  isChooseMode?: boolean
  setIsChooseMode?: React.Dispatch<React.SetStateAction<boolean>>
  chooseMap?: Record<string, boolean>
  hiddenMap?: Record<string, boolean>
}

export interface BoxItemProps {
  id: string
  index: number
  subject: string
  // desc: string
  to: AddressListResponse
  from: AddressResponse
  date: string
  isChoose?: boolean
  avatarBadgeType: AvatarBadgeType
  itemType: ItemType
  onClickAvatar?: BoxListProps['onClickAvatar']
  onClick?: () => void
  isChooseMode?: boolean
  setIsChooseMode?: React.Dispatch<React.SetStateAction<boolean>>
  chooseMap?: BoxListProps['chooseMap']
}

const CircleE = styled(Circle)`
  background: #ffffff;
  border: 3px solid #4e52f5;
  border-radius: 50px;
`

const Item = ({
  subject,
  // desc,
  date,
  id,
  index,
  onClickAvatar,
  onClick,
  avatarBadgeType,
  itemType,
  to,
  from,
  isChoose,
  isChooseMode,
  setIsChooseMode,
  chooseMap,
}: BoxItemProps) => {
  const AvatarBadgeE = {
    [AvatarBadgeType.None]: <Box />,
    [AvatarBadgeType.New]: (
      <AvatarBadge
        boxSize="10px"
        bg="#9093F9"
        top="0"
        bottom="auto"
        border="none"
      />
    ),
    [AvatarBadgeType.SentOK]: (
      <AvatarBadge boxSize="10px" bg="#000" top="0" bottom="auto" border="none">
        <CheckIcon color="#fff" w="5px" h="5px" />
      </AvatarBadge>
    ),
    [AvatarBadgeType.SentFail]: (
      <AvatarBadge
        boxSize="10px"
        bg="#FF5F57"
        top="0"
        bottom="auto"
        border="none"
      >
        <CloseIcon color="#fff" w="5px" h="5px" />
      </AvatarBadge>
    ),
  }[avatarBadgeType]

  const AvatarBox = (
    <Flex w="48px">
      <Avatar
        cursor="pointer"
        address={from.address}
        w="48px"
        h="48px"
        showBorder
        onClick={(e) => {
          e.stopPropagation()
          if (onClickAvatar) onClickAvatar(index, id)
          if (setIsChooseMode) setIsChooseMode(true)
          return false
        }}
        borderRadius="50%"
      >
        {AvatarBadgeE}
      </Avatar>
      {/* <Center
        flexGrow={1}
        w="48px"
        h="48px"
        zIndex={9}
        background="#6F6F6F"
        border="1px solid #FFFFFF"
        borderRadius="50px"
        transform="translateX(-70%)"
        onClick={(e) => {
          e.stopPropagation()
          if (update) update(index)
          setIsChooseMode(true)
          return false
        }}
      >
        10
      </Center> */}
    </Flex>
  )

  const desc = `${from?.address} - ${to
    ?.map((item) => `${item?.address}`)
    ?.join(';')}`

  return (
    <Flex
      align="center"
      bg={itemType === ItemType.Fail ? '#FFF9F9' : ''}
      margin="20px 0"
      p="5px"
      borderRadius="8px"
      transition="all .2s ease-out"
      _hover={{
        color: '#fff',
        bg: '#000000',
      }}
      // _active={{
      //   color: '#6F6F6F',
      //   bg: '#E5E5E5',
      // }}
    >
      <Box w="48px">
        {isChooseMode ? (
          <CircleE
            size="48px"
            cursor="pointer"
            onClick={(e) => {
              e.stopPropagation()
              if (onClickAvatar) onClickAvatar(index, id)
              return false
            }}
          >
            {(isChoose || (chooseMap && chooseMap[index])) && <ChooseSVG />}
          </CircleE>
        ) : (
          AvatarBox
        )}
      </Box>
      <Flex
        marginLeft="20px"
        align="center"
        w="100%"
        onClick={onClick}
        cursor="pointer"
      >
        <Flex flex={1} wrap="wrap" alignContent="center">
          <Text
            wordBreak="break-all"
            fontWeight="600"
            fontSize="16px"
            lineHeight={1.2}
            maxW="100%"
            w="100%"
            noOfLines={1}
          >
            {subject}
          </Text>
          <Text
            wordBreak="break-all"
            fontWeight="400"
            fontSize="14px"
            mt="8px"
            lineHeight={1.2}
            maxW="100%"
            w="100%"
            noOfLines={1}
          >
            {desc}
          </Text>
        </Flex>
        <Box fontSize="14px" marginLeft="20px" color="#6F6F6F">
          {dynamicDateString(date)}
        </Box>
      </Flex>
    </Flex>
  )
}

export const BoxList: React.FC<BoxListProps> = ({
  data,
  onClickAvatar,
  onClickBody,
  isChooseMode,
  setIsChooseMode,
  chooseMap,
  hiddenMap,
}) => (
  <Box>
    {data.map((item, index) => {
      const { id } = item

      if (hiddenMap && hiddenMap[id]) {
        return <Box />
      }

      return (
        <Item
          key={id}
          {...item}
          index={index}
          chooseMap={chooseMap}
          onClickAvatar={onClickAvatar}
          isChooseMode={isChooseMode}
          setIsChooseMode={setIsChooseMode}
          onClick={() => {
            onClickBody(id)
          }}
        />
      )
    })}
  </Box>
)

export interface InfiniteListProps<
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
  calcDataLength?: (data?: InfiniteData<TData>) => number
  onDataChange?: (data?: MessageItem[]) => void
  onChooseModeChange?: (bool: boolean) => void
  onClickBody?: BoxListProps['onClickBody']
}

export interface InfiniteHandle {
  getChooseIds: () => string[]
  setHiddenIds: (ids: string[]) => void
}

const InfiniteListComponent: ForwardRefRenderFunction<
  InfiniteHandle,
  InfiniteListProps<MailboxesMessagesResponse>
> = (
  {
    queryFn,
    queryKey,
    queryOptions,
    emptyElement,
    noMoreElement,
    loader,
    enableQuery,
    onDataChange,
    onChooseModeChange,
    onClickBody,
  },
  forwardedRef
) => {
  const { data, status, hasNextPage, fetchNextPage } = useInfiniteQuery(
    queryKey,
    queryFn,
    {
      getNextPageParam: (lastPage) => {
        if (lastPage.messages.length > 0) {
          return lastPage.page + 1
        }
        return undefined
      },
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      ...queryOptions,
      enabled: enableQuery,
    }
  )

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
    onDataChange?.(dataMsg)
  }, [dataMsg])

  useEffect(() => {
    onChooseModeChange?.(isChooseMode)
  }, [isChooseMode])

  useEffect(() => {
    if (Object.values(chooseMap).every((e) => !e)) {
      setIsChooseMode(false)
    }
  }, [chooseMap])

  useImperativeHandle(forwardedRef, () => ({
    getChooseIds() {
      return Object.keys(chooseMap)
        .filter((key) => chooseMap[key])
        .map((index: any) => dataMsg[index].id)
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
          endMessage={noMoreElement}
          style={{ overflow: 'hidden' }}
        >
          <BoxList
            data={dataMsg}
            isChooseMode={isChooseMode}
            setIsChooseMode={setIsChooseMode}
            chooseMap={chooseMap}
            hiddenMap={hiddenMap}
            onClickAvatar={(index) => {
              const newMap = { ...chooseMap }
              newMap[index] = !newMap[index]
              setChooseMap(newMap)
            }}
            onClickBody={(id) => {
              if (!onClickBody) return
              onClickBody(id)
            }}
          />
          {status === 'success' && dataLength === 0
            ? emptyElement ?? 'empty'
            : null}
        </InfiniteScroll>
      )}
    </Box>
  )
}

export const InfiniteList = forwardRef(InfiniteListComponent)
