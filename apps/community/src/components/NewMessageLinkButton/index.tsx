import { Link as InsideLink } from 'react-router-dom'
import { AddIcon } from '@chakra-ui/icons'
import { Center, CenterProps } from '@chakra-ui/react'
import dayjs, { Dayjs } from 'dayjs'
import { useTranslation } from 'react-i18next'
import { RoutePath } from '../../route/path'
import { useToast } from '../../hooks/useToast'

export const NewMessageLinkButton: React.FC<
  CenterProps & {
    lastMessageSentTime?: string | Dayjs
  }
> = ({ lastMessageSentTime, ...props }) => {
  const { t } = useTranslation('common')
  const toast = useToast()
  return (
    <Center
      as={InsideLink}
      to={RoutePath.NewMessage}
      target="_blank"
      w="full"
      mt="20px"
      flex={1}
      borderColor="primary.900"
      color="primary.900"
      borderWidth="2px"
      borderStyle="dashed"
      rounded="14px"
      onClick={
        lastMessageSentTime
          ? (e) => {
              const allowTime = (
                typeof lastMessageSentTime === 'string'
                  ? dayjs(lastMessageSentTime)
                  : lastMessageSentTime
              ).add(1, 'day')
              if (allowTime.isAfter(dayjs())) {
                e.stopPropagation()
                e.preventDefault()
                toast(t('send_time_limit'))
              }
            }
          : undefined
      }
      {...props}
    >
      <AddIcon w="16px" h="16px" />
    </Center>
  )
}
