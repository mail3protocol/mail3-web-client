import { Link as InsideLink, useNavigate } from 'react-router-dom'
import { AddIcon } from '@chakra-ui/icons'
import { Center, CenterProps, Spinner } from '@chakra-ui/react'
import { Dayjs } from 'dayjs'
import { Trans, useTranslation } from 'react-i18next'
import { isNextDay } from 'shared/src/isNextDay'
import { useTrackClick, TrackEvent, useDialog } from 'hooks'
import { useQuery } from 'react-query'
import { RoutePath } from '../../route/path'
import { useToast } from '../../hooks/useToast'
import {
  SubscriptionResponse,
  SubscriptionState,
} from '../../api/modals/SubscriptionResponse'
import { QueryKey } from '../../api/QueryKey'
import { useAPI } from '../../hooks/useAPI'

export const NewMessageLinkButton: React.FC<
  CenterProps & {
    lastMessageSentTime?: Dayjs
    isLoading?: boolean
  }
> = ({ lastMessageSentTime, isLoading = false, ...props }) => {
  const { t } = useTranslation('common')
  const toast = useToast()
  const trackClickNewMessage = useTrackClick(
    TrackEvent.CommunityClickNewMessage
  )
  const api = useAPI()
  const { data, isLoading: isLoadingSubscriptionState } =
    useQuery<SubscriptionResponse>([QueryKey.GetSubscriptionState], async () =>
      api.getSubscription().then((r) => r.data)
    )
  const dialog = useDialog()
  const navi = useNavigate()
  const currentIsLoading = isLoading || isLoadingSubscriptionState

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
        if (currentIsLoading) return
        if (data?.state !== SubscriptionState.Active) {
          e.stopPropagation()
          e.preventDefault()
          dialog({
            title: t('need_open_earn_nft_dialog.title'),
            description: (
              <Trans
                t={t}
                i18nKey="need_open_earn_nft_dialog.description"
                components={{ b: <b /> }}
              />
            ),
            okText: t('need_open_earn_nft_dialog.confirm'),
            onConfirm() {
              navi(RoutePath.EarnNft)
            },
          })
          return
        }
        if (lastMessageSentTime && !isNextDay(lastMessageSentTime)) {
          e.stopPropagation()
          e.preventDefault()
          toast(t('send_time_limit'))
        }
      }}
      style={{
        opacity: currentIsLoading ? 0.6 : undefined,
        cursor: currentIsLoading ? 'wait' : undefined,
      }}
      {...props}
    >
      {currentIsLoading ? (
        <Spinner w="16px" h="16px" />
      ) : (
        <AddIcon w="16px" h="16px" />
      )}
    </Center>
  )
}
