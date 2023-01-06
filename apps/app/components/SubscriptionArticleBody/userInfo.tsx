import {
  Center,
  LinkBox,
  LinkOverlay,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import styled from '@emotion/styled'
import { RewardType } from 'models'
import { Avatar, Button } from 'ui'
import { SimpleSubscribePage } from '../../pages/subscribe'

interface UserInfoProps {
  uuid?: string
  priAddress: string
  nickname: string
  mailAddress: string
  desc?: string
}

const AvatarArea = styled(LinkBox)`
  &:hover {
    .nickname {
      text-decoration: underline;
    }
  }
`

export const UserInfo: React.FC<UserInfoProps> = ({
  priAddress,
  nickname,
  mailAddress,
  desc,
  uuid,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Center
      p={{ base: '10px 25px', md: '48px 32px' }}
      w={{ base: 'full', md: '305px' }}
      flexDirection="column"
      justifyContent="flex-start"
      border={{ base: 'none', md: '1px solid rgba(0, 0, 0, 0.1)' }}
      borderTop="none"
    >
      <AvatarArea w="100%">
        <LinkOverlay href="#">
          <Center flexDirection="column" justifyContent="flex-start">
            <Avatar
              address={priAddress}
              borderRadius="50%"
              w={{ base: '80px', md: '100px' }}
              h={{ base: '80px', md: '100px' }}
            />
            <Text
              className="nickname"
              fontWeight="700"
              fontSize="18px"
              lineHeight="24px"
              mt="8px"
            >
              {nickname}
            </Text>
          </Center>
        </LinkOverlay>
      </AvatarArea>

      <Text fontWeight="500" fontSize="14px" lineHeight="16px" mt="14px">
        {mailAddress}
      </Text>

      <Text
        fontWeight="400"
        fontSize="12px"
        lineHeight="18px"
        color="rgba(0, 0, 0, 0.7)"
        mt="32px"
      >
        {desc}
      </Text>

      <Button mt="24px" onClick={onOpen}>
        Subscribe
      </Button>

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent maxW="80vw" h="80vh">
          <ModalCloseButton />
          <ModalBody>
            <SimpleSubscribePage
              isDialog
              uuid={uuid}
              rewardType={RewardType.AIR}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Center>
  )
}
