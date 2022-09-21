import { Box, Circle, Flex, Image, Spacer, Text } from '@chakra-ui/react'
import styled from '@emotion/styled'
import { Subscription } from 'models'
import { FC } from 'react'

const Container = styled(Box)`
  flex: 1;
  border-right: 1px solid #dedede;
  height: 100%;
  overflow: hidden;
  overflow-y: scroll;
`

const SubListItemWrap = styled(Flex)`
  padding: 20px 20px 20px 40px;
  cursor: pointer;
  position: relative;

  :hover {
    background-color: #ededed;
  }

  .point {
    top: 50%;
    left: -10px;
    transform: translate(-100%, -50%);
    width: 12px;
    height: 12px;
    position: absolute;
    background-color: #4e51f4;
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
        {!seen && !isClicked ? <Circle className="point" /> : null}
        <Circle size="72px" overflow="hidden">
          <Image src="" w="100%" h="100%" />
        </Circle>
      </Box>
      <Box pl="33px">
        <Text
          h="52px"
          fontSize="16px"
          fontWeight={600}
          noOfLines={2}
          lineHeight="26px"
        >
          {subject}
        </Text>
        <Flex fontSize="14px" fontWeight={400} color="#818181">
          <Text noOfLines={1}>{writer}</Text>
          <Spacer />
          <Box>{time}</Box>
        </Flex>
      </Box>
    </SubListItemWrap>
  )
}

// list ui
// list infinite
const SubList: FC = () => {
  const mock = [
    {
      uuid: 'string',
      subject: 'The More Important the Work, the More Important the Rest',
      writer: 'Meta',
      seen: false,
      created_at: 'Aug 27 / 9:07 am',
    },
    {
      uuid: 'string2',
      subject: 'The More Important the Work, the More Important the Rest',
      writer: 'Meta',
      seen: false,
      created_at: 'Aug 27 / 9:07 am',
    },
    {
      uuid: 'string3',
      subject: 'The More Important the Work, the More Important the Rest',
      writer: 'Meta',
      seen: false,
      created_at: 'Aug 27 / 9:07 am',
    },
  ]

  return (
    <Box>
      {mock.map((item) => {
        const { uuid } = item
        return (
          <SubListItem
            key={uuid}
            data={item}
            isClicked={false}
            onClick={() => {
              console.log('click', uuid)
            }}
          />
        )
      })}
    </Box>
  )
}

export const SubLeftList: FC = () => (
  // loading

  // empty

  <Container>
    <SubList />
  </Container>
)
