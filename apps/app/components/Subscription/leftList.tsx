import {
  Avatar,
  Box,
  Center,
  Circle,
  Flex,
  Spacer,
  Spinner,
  Text,
  useMediaQuery,
} from '@chakra-ui/react'
import styled from '@emotion/styled'
import { atom, useAtom } from 'jotai'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useUpdateAtom } from 'jotai/utils'
import { Subscription } from 'models'
import { FC, useEffect, useMemo, useRef, useState } from 'react'
import { useInfiniteQuery } from 'react-query'
import { useAPI } from '../../hooks/useAPI'
import { SubPreviewIdAtom, SubPreviewIsOpenAtom } from './preview'
import { SubWrapEmptyAtom } from './wrap'

const Container = styled(Box)`
  flex: 9;
  height: 100%;
  box-shadow: 0px 0px 10px rgba(25, 25, 100, 0.1);

  &::-webkit-scrollbar {
    width: 0 !important;
    height: 0 !important;
  }

  @media (max-width: 768px) {
    padding-top: 30px;
    box-shadow: none;
  }
`

const Badge = styled(Circle)`
  top: 2px;
  right: 2px;
  height: 10px;
  width: 10px;
  position: absolute;
`

const SubListItemWrap = styled(Flex)`
  padding: 14px 20px 8px 32px;
  cursor: pointer;
  position: relative;
  border-bottom: 1px solid #f3f3f3;

  :hover {
    background-color: #f3f3f3;
  }

  &.cur {
    background-color: #e7e7e7;
  }
`

// item
// click set SubpreviewIdAtom id
interface SubListItemProps {
  onClick: () => void
  isClicked: boolean
  data: Subscription.MessageResp
  isChoose: boolean
}

export const isClickMapAtom = atom<Record<string, boolean>>({})

export const SubListItem: FC<SubListItemProps> = ({
  onClick,
  isClicked,
  data,
  isChoose,
}) => {
  const { uuid, seen, subject, writer, created_at: time } = data

  return (
    <SubListItemWrap
      data-uuid={uuid}
      onClick={() => {
        if (typeof onClick === 'function') onClick()
      }}
      className={isChoose ? 'cur' : ''}
    >
      <Box position="relative">
        <Avatar w="48px">
          {!seen && !isClicked ? <Badge boxSize="10px" bg="#9093F9" /> : null}
        </Avatar>
      </Box>
      <Box pl="24px" w="100%">
        <Text
          h="44px"
          fontSize="14px"
          fontWeight={600}
          noOfLines={2}
          lineHeight="20px"
          color={!seen && !isClicked ? '#000' : '#6F6F6F'}
        >
          {subject}
        </Text>
        <Flex
          fontSize="12px"
          fontWeight={400}
          color="#818181"
          lineHeight="26px"
        >
          <Text noOfLines={1}>{writer}</Text>
          <Spacer />
          <Box>{time}</Box>
        </Flex>
      </Box>
    </SubListItemWrap>
  )
}

// list ui
interface SubListProps {
  data: Subscription.MessageResp[]
}
const SubList: FC<SubListProps> = ({ data }) => {
  const setIsOpen = useUpdateAtom(SubPreviewIsOpenAtom)
  const [id, setId] = useAtom(SubPreviewIdAtom)
  const [isClickMap, setIsClickMap] = useAtom(isClickMapAtom)

  return (
    <Box p="10px 0">
      {data.map((item) => {
        const { uuid } = item
        return (
          <SubListItem
            isChoose={id === uuid}
            key={uuid}
            data={item}
            isClicked={isClickMap[uuid]}
            onClick={() => {
              setIsOpen(true)
              setId(uuid)
              setIsClickMap({
                ...isClickMap,
                [uuid]: true,
              })
              console.log('click', uuid)
            }}
          />
        )
      })}
    </Box>
  )
}

export const SubLeftList: FC = () => {
  // list infinite
  const setEmpty = useUpdateAtom(SubWrapEmptyAtom)
  const api = useAPI()
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollHeight, setScrollHeight] = useState(0)
  const [isMaxWdith600] = useMediaQuery(`(max-width: 768px)`)

  useEffect(() => {
    if (isMaxWdith600) return
    console.log(containerRef.current?.clientHeight)
    setScrollHeight(containerRef.current?.clientHeight || 0)
  })

  const { data, isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery(
    ['SubscriptionList'],
    async ({ pageParam = '' }) => {
      const ret = await api.SubscriptionMessages(pageParam)
      return ret.data
    },
    {
      getNextPageParam: (lastPage) => {
        if (lastPage.next_cursor) {
          return lastPage.next_cursor
        }
        return undefined
      },
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    }
  )

  const listData = useMemo(
    () => data?.pages.map((item) => item.messages).flat() || [],
    [data]
  )

  useEffect(() => {
    if (isLoading) return
    if (!listData?.length) {
      setEmpty(true)
    } else {
      setEmpty(false)
    }
  }, [listData, isLoading])

  // loading
  if (isLoading)
    return (
      <Container>
        <Center w="100%" minH="200px">
          <Spinner />
        </Center>
      </Container>
    )
  // empty
  if (!listData) return <Container>Empty</Container>

  return (
    <Container ref={containerRef}>
      {scrollHeight || isMaxWdith600 ? (
        <InfiniteScroll
          dataLength={listData.length}
          next={fetchNextPage}
          height={isMaxWdith600 ? 'auto' : scrollHeight}
          hasMore={hasNextPage === true}
          loader={
            <Center h="50px">
              <Spinner />
            </Center>
          }
        >
          <SubList data={listData} />
        </InfiniteScroll>
      ) : null}
    </Container>
  )
}
