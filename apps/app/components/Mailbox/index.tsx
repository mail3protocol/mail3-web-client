import { Avatar } from 'ui'
import { AvatarBadge, Box, Circle, Flex, Text } from '@chakra-ui/react'
import styled from '@emotion/styled'
import classNames from 'classnames'
import { CheckIcon, CloseIcon } from '@chakra-ui/icons'
import { useTranslation } from 'next-i18next'
import Link, { LinkProps } from 'next/link'
import ChooseSVG from '../../assets/mailbox/choose.svg'
import { MailboxMessageItemResponse } from '../../api'
import { dynamicDateString, removeMailSuffix } from '../../utils'

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

  :active {
    color: #fff;
    background-color: #000000;
    .date {
      color: #fff;
    }
  }

  &.focus {
    color: #6f6f6f;
    background-color: #f3f3f3;
  }

  .date {
    color: #6f6f6f;
  }
`

const avatarBadgConfig = {
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
}

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
  href,
}: BoxItemProps) => {
  const [t] = useTranslation('mailboxes')
  const fromAddress = removeMailSuffix(from.address)

  const AvatarBox = (
    <Flex w="48px">
      <Avatar
        cursor="pointer"
        address={fromAddress}
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
        {avatarBadgConfig[avatarBadgeType]}
      </Avatar>
    </Flex>
  )

  const desc = `${from?.address} - ${to
    ?.map((item) => `${item?.address}`)
    ?.join(';')}`

  return (
    <ItemFlex
      className={classNames({
        focus: isChoose || (chooseMap && chooseMap[id]),
      })}
      align="flex-start"
      bg={itemType === ItemType.Fail ? '#FFF9F9' : ''}
      margin={{ base: 0, md: '20px 0' }}
      p={{ base: '20px', md: '5px' }}
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
              {desc}
            </Text>
          </Flex>
          <Box
            className="date"
            fontSize="14px"
            mt={{ base: '20px' }}
            ml={{ md: '20px' }}
          >
            {dynamicDateString(date)}
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
        />
      )
    })}
  </Box>
)
