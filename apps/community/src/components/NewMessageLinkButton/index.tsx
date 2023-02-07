import { Link as InsideLink } from 'react-router-dom'
import { AddIcon } from '@chakra-ui/icons'
import { Center, CenterProps, Spinner } from '@chakra-ui/react'
import { RoutePath } from '../../route/path'
import {
  useOpenNewMessagePage,
  UseNewMessagePageProps,
} from '../../hooks/useOpenNewMessagePage'

export const NewMessageLinkButton: React.FC<
  CenterProps & UseNewMessagePageProps
> = ({ lastMessageSentTime, isLoading = false, ...props }) => {
  const { onClick, isLoading: currentIsLoading } = useOpenNewMessagePage({
    lastMessageSentTime,
    isLoading,
  })

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
      onClick={onClick}
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
