import { Link as InsideLink } from 'react-router-dom'
import { AddIcon } from '@chakra-ui/icons'
import { ButtonProps, Center, LinkProps, Spinner } from '@chakra-ui/react'
import { RoutePath } from '../../route/path'
import {
  useOpenNewMessagePage,
  UseNewMessagePageProps,
} from '../../hooks/useOpenNewMessagePage'

export const PureStyledNewMessageButton: React.FC<
  ButtonProps & LinkProps & { to?: string }
> = ({ isLoading, children, ...props }) => (
  <Center
    w="full"
    mt="20px"
    flex={1}
    borderColor="primary.900"
    color="primary.900"
    border="1px solid"
    bg="white"
    _disabled={{
      color: 'primary.900',
      bg: 'white',
    }}
    _hover={{
      borderColor: '#ECECF4',
      bg: '#ECECF4',
      _disabled: {
        color: 'primary.900',
        bg: '#f00',
      },
    }}
    _active={{
      color: `white`,
      bg: '#A1A2F4',
      borderColor: '#A1A2F4',
      _disabled: {
        color: 'primary.900',
        bg: 'white',
      },
    }}
    rounded="14px"
    style={{
      opacity: isLoading ? 0.6 : undefined,
      cursor: isLoading ? 'wait' : undefined,
      pointerEvents: isLoading ? 'none' : undefined,
    }}
    {...(props as any)}
  >
    {isLoading ? <Spinner w="16px" h="16px" /> : children}
  </Center>
)

export const NewMessageLinkButton: React.FC<
  Omit<ButtonProps & LinkProps, 'onClick' | 'children'> & UseNewMessagePageProps
> = ({ lastMessageSentTime, isLoading = false, ...props }) => {
  const { onClick, isLoading: currentIsLoading } = useOpenNewMessagePage({
    lastMessageSentTime,
    isLoading,
  })

  return (
    <PureStyledNewMessageButton
      as={InsideLink}
      to={RoutePath.NewMessage}
      target="_blank"
      isLoading={currentIsLoading}
      onClick={onClick}
      {...props}
    >
      <AddIcon w="16px" h="16px" />
    </PureStyledNewMessageButton>
  )
}
