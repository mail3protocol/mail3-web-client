import { Link as InsideLink } from 'react-router-dom'
import { AddIcon } from '@chakra-ui/icons'
import { Center } from '@chakra-ui/react'
import { RoutePath } from '../../route/path'

export const NewMessageLinkButton: React.FC = () => (
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
  >
    <AddIcon w="16px" h="16px" />
  </Center>
)
