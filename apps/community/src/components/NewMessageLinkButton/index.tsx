import { Link as InsideLink } from 'react-router-dom'
import { AddIcon } from '@chakra-ui/icons'
import { Center, CenterProps } from '@chakra-ui/react'
import { Dayjs } from 'dayjs'
import { useTranslation } from 'react-i18next'
import { isNextDay } from 'shared/src/isNextDay'
import { useTrackClick, TrackEvent } from 'hooks'
import { RoutePath } from '../../route/path'
import { useToast } from '../../hooks/useToast'

export const NewMessageLinkButton: React.FC<
  CenterProps & {
    lastMessageSentTime?: Dayjs
  }
> = ({ lastMessageSentTime, ...props }) => {
  const { t } = useTranslation('common')
  const toast = useToast()
  const trackClickNewMessage = useTrackClick(
    TrackEvent.CommunityClickNewMessage
  )
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
      onClick={(e) => {
        trackClickNewMessage()
        if (lastMessageSentTime && !isNextDay(lastMessageSentTime)) {
          e.stopPropagation()
          e.preventDefault()
          toast(t('send_time_limit'))
        }
      }}
      {...props}
    >
      <AddIcon w="16px" h="16px" />
    </Center>
  )
}
