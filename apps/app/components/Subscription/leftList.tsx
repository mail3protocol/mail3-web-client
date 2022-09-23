import { Avatar, Box, Circle, Flex, Spacer, Text } from '@chakra-ui/react'
import styled from '@emotion/styled'
import { useUpdateAtom } from 'jotai/utils'
import { Subscription } from 'models'
import { FC, useMemo } from 'react'
import { useInfiniteQuery } from 'react-query'
import { SubPreviewIdAtom, SubPreviewIsOpenAtom } from './preview'

const Container = styled(Box)`
  flex: 9;
  height: 100%;
  overflow: hidden;
  overflow-y: scroll;
  box-shadow: 0px 0px 10px rgba(25, 25, 100, 0.1);
  padding: 20px 0;

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
`

// item
// click set SubpreviewIdAtom id
interface SubListItemProps {
  onClick: () => void
  isClicked: boolean
  data: Subscription.MessageResp
}
export const SubListItem: FC<SubListItemProps> = ({
  onClick,
  isClicked,
  data,
}) => {
  const { uuid, seen, subject, writer, created_at: time } = data

  return (
    <SubListItemWrap
      data-uuid={uuid}
      onClick={() => {
        if (typeof onClick === 'function') onClick()
      }}
    >
      <Box position="relative">
        <Avatar w="48px">
          {!seen && !isClicked ? <Badge boxSize="10px" bg="#9093F9" /> : null}
        </Avatar>
      </Box>
      <Box pl="24px">
        <Text
          h="52px"
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
  const setPreivewId = useUpdateAtom(SubPreviewIdAtom)

  return (
    <Box>
      {data.map((item) => {
        const { uuid } = item
        return (
          <SubListItem
            key={uuid}
            data={item}
            isClicked={false}
            onClick={() => {
              setIsOpen(true)
              setPreivewId(uuid)
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

  const { data, isLoading } = useInfiniteQuery<Subscription.MessageListResp>(
    ['SubscriptionList'],
    () =>
      new Promise((r) => {
        setTimeout(() => {
          const mock = {
            messages: [
              {
                uuid: 'string',
                subject:
                  'The More Important the Work, the More Important the Rest',
                writer: 'Meta',
                seen: false,
                created_at: 'Aug 27 / 9:07 am',
              },
              {
                uuid: 'string2',
                subject:
                  'The More Important the Work, the More Important the Rest',
                writer: 'Meta',
                seen: false,
                created_at: 'Aug 27 / 9:07 am',
              },
              {
                uuid: 'string3',
                subject:
                  'The More Important the Work, the More Important the Rest',
                writer: 'Meta',
                seen: false,
                created_at: 'Aug 27 / 9:07 am',
              },
              {
                uuid: 'string3',
                subject:
                  'The More Important the Work, the More Important the Rest',
                writer: 'Meta',
                seen: false,
                created_at: 'Aug 27 / 9:07 am',
              },
              {
                uuid: 'string3',
                subject:
                  'The More Important the Work, the More Important the Rest',
                writer: 'Meta',
                seen: false,
                created_at: 'Aug 27 / 9:07 am',
              },
              {
                uuid: 'string3',
                subject:
                  'The More Important the Work, the More Important the Rest',
                writer: 'Meta',
                seen: false,
                created_at: 'Aug 27 / 9:07 am',
              },
              {
                uuid: 'string3',
                subject:
                  'The More Important the Work, the More Important the Rest',
                writer: 'Meta',
                seen: false,
                created_at: 'Aug 27 / 9:07 am',
              },
              {
                uuid: 'string3',
                subject:
                  'The More Important the Work, the More Important the Rest',
                writer: 'Meta',
                seen: false,
                created_at: 'Aug 27 / 9:07 am',
              },
            ],
          }
          r(mock as Subscription.MessageListResp)
        }, 1000)
      }),
    {
      getNextPageParam: (lastPage: any) => {
        if (typeof lastPage?.page !== 'number') return undefined
        if (lastPage.page >= lastPage.pages - 1) {
          return undefined
        }
        return lastPage.page + 1
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

  // loading
  if (isLoading) return <Container>loading</Container>
  // empty
  if (!listData) return <Container>Empty</Container>

  return (
    <Container>
      <SubList data={listData} />
    </Container>
  )
}
