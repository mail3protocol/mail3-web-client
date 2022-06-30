import { Avatar } from 'ui'
import { Box, Circle, Flex, Text } from '@chakra-ui/react'
import styled from '@emotion/styled'
import classNames from 'classnames'
import { useTranslation } from 'next-i18next'
import Link, { LinkProps } from 'next/link'
import { useMemo } from 'react'
import { isPrimitiveEthAddress, truncateMiddle } from 'shared'
import ChooseSVG from '../../assets/mailbox/choose.svg'
import { MailboxMessageItemResponse } from '../../api'
import { formatDateString, removeMailSuffix } from '../../utils'
import { Mailboxes } from '../../api/mailboxes'

export enum AvatarBadgeType {
  None,
  New,
}

export enum ItemType {
  None,
  Fail,
}

export interface MessageItem extends MailboxMessageItemResponse {
  // ui need state
  isChoose: boolean
  avatarBadgeType: AvatarBadgeType
  itemType: ItemType
}

export interface BoxListProps {
  data: Array<MessageItem>
  onClickAvatar?: (index: number, id: string) => void
  onClickBody: (id: string) => void
  isChooseMode?: boolean
  setIsChooseMode?: React.Dispatch<React.SetStateAction<boolean>>
  chooseMap?: Record<string, boolean>
  hiddenMap?: Record<string, boolean>
  getHref: (id: string) => LinkProps['href']
  mailboxType?: Mailboxes
}

export interface BoxItemProps extends MailboxMessageItemResponse {
  index: number
  isChoose?: boolean
  avatarBadgeType: AvatarBadgeType
  itemType: ItemType
  onClickAvatar?: BoxListProps['onClickAvatar']
  onClick?: () => void
  isChooseMode?: boolean
  setIsChooseMode?: React.Dispatch<React.SetStateAction<boolean>>
  chooseMap?: BoxListProps['chooseMap']
  href: LinkProps['href']
  mailboxType?: Mailboxes
}

const CircleE = styled(Circle)`
  background: #ffffff;
  border: 3px solid #4e52f5;
  border-radius: 50px;
`

const ItemFlex = styled(Flex)`
  transition: background-color 0.2s ease-out, color 0.2s ease-out;

  :hover {
    background-color: #f3f3f3;
  }

  /* :active {
    color: #fff;
    background-color: #000000;
    .date {
      color: #fff;
    }
  } */

  &.focus {
    color: #6f6f6f;
    background-color: #f3f3f3;
  }

  .date {
    color: #6f6f6f;
  }

  @media (max-width: 600px) {
    :hover {
      background-color: transparent;
    }
  }
`

const Badge = styled(Circle)`
  top: 2px;
  right: 2px;
  height: 10px;
  width: 10px;
  position: absolute;
`

const avatarBadgConfig = {
  [AvatarBadgeType.None]: <Box />,
  [AvatarBadgeType.New]: <Badge boxSize="10px" bg="#9093F9" />,
}

const Item: React.FC<BoxItemProps> = ({
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
  cc,
  bcc,
  isChoose,
  isChooseMode,
  setIsChooseMode,
  chooseMap,
  href,
  mailboxType,
}) => {
  const [t] = useTranslation('mailboxes')

  const receiverList = useMemo(() => {
    if (!to) return []
    const exists: Array<string> = []

    let arr = [...to]
    if (cc) arr = [...arr, ...cc]
    if (bcc) arr = [...arr, ...bcc]

    arr = arr.filter(({ address }) => {
      if (exists.includes(address.toLocaleLowerCase())) return false
      exists.push(address.toLocaleLowerCase())
      return true
    })

    return arr
  }, [to, cc, bcc])

  let AvatarBox = (
    <Flex w="48px" position="relative">
      <Avatar
        cursor="pointer"
        address={removeMailSuffix(from.address)}
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
      />
      {avatarBadgConfig[avatarBadgeType]}
    </Flex>
  )

  if (
    receiverList.length &&
    (mailboxType === Mailboxes.Sent || mailboxType === Mailboxes.Drafts)
  ) {
    AvatarBox = (
      <Flex w="48px">
        <Box transform={receiverList.length > 1 ? 'translateX(-20%)' : ''}>
          <Avatar
            cursor="pointer"
            address={removeMailSuffix(receiverList[0].address)}
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
          />
        </Box>

        {receiverList.length === 2 ? (
          <Box transform="translateX(-80%)">
            <Avatar
              cursor="pointer"
              address={removeMailSuffix(receiverList[1].address)}
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
            />
          </Box>
        ) : null}

        {receiverList.length > 2 ? (
          <Circle
            as="button"
            size="48px"
            bg="#6f6f6f"
            border="1px solid #fff"
            color="#fff"
            fontSize="12px"
            onClick={(e) => {
              e.stopPropagation()
              if (onClickAvatar) onClickAvatar(index, id)
              if (setIsChooseMode) setIsChooseMode(true)
              return false
            }}
            transform="translateX(-80%)"
          >
            <p>{receiverList.length - 1}</p>
          </Circle>
        ) : null}
      </Flex>
    )
  }

  const desc = useMemo(() => {
    if (mailboxType === Mailboxes.Sent || mailboxType === Mailboxes.Drafts) {
      return receiverList
        .map((item) => {
          const [addr] = item.address.split('@')
          if (isPrimitiveEthAddress(addr)) {
            return truncateMiddle(addr, 6, 4)
          }
          return addr
        })
        .join('; ')
    }

    if (from.name) {
      return from.name
    }
    const [addr] = from.address.split('@')
    if (isPrimitiveEthAddress(addr)) {
      return truncateMiddle(addr, 6, 4)
    }

    return addr
  }, [from, receiverList])

  return (
    <ItemFlex
      className={classNames({
        focus: isChoose || (chooseMap && chooseMap[id]),
      })}
      align="flex-start"
      bg={itemType === ItemType.Fail ? '#FFF9F9' : ''}
      margin={{ base: 0, md: '20px 0' }}
      p={{ base: '20px', md: '5px 5px 5px 10px' }}
      borderRadius={{ base: 0, md: '8px' }}
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
            {(isChoose || (chooseMap && chooseMap[id])) && <ChooseSVG />}
          </CircleE>
        ) : (
          AvatarBox
        )}
      </Box>
      <Link href={href} passHref>
        <Flex
          as="a"
          marginLeft="20px"
          align={{ base: 'flex-start', md: 'center' }}
          flexDirection={{ base: 'column', md: 'row' }}
          w="100%"
          onClick={onClick}
          cursor="pointer"
        >
          <Flex flex={1} wrap="wrap" alignContent="center">
            <Text
              width="100%"
              wordBreak="break-all"
              fontWeight="600"
              fontSize="16px"
              noOfLines={1}
            >
              {subject || t('no-subject')}
            </Text>
            <Text
              wordBreak="break-all"
              fontWeight="400"
              fontSize="14px"
              pt="5px"
              lineHeight={1.3}
              noOfLines={{ base: 3, md: 1 }}
            >
              {`${desc}${desc ? ';' : ''}`}
            </Text>
          </Flex>
          <Box
            className="date"
            fontSize="14px"
            mt={{ base: '20px' }}
            ml={{ md: '20px' }}
          >
            {formatDateString(date)}
          </Box>
        </Flex>
      </Link>
    </ItemFlex>
  )
}

export const Mailbox: React.FC<BoxListProps> = ({
  data,
  onClickAvatar,
  onClickBody,
  isChooseMode,
  setIsChooseMode,
  chooseMap,
  hiddenMap,
  getHref,
  mailboxType,
}) => (
  <Box>
    {data.map((item, index) => {
      const { id } = item

      if (hiddenMap && hiddenMap[id]) {
        return null
      }

      const href = getHref ? getHref(id) : ''

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
          href={href}
          mailboxType={mailboxType}
        />
      )
    })}
  </Box>
)
