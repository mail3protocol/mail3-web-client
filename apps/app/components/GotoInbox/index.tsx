import { Button, HStack, Text } from '@chakra-ui/react'
import React from 'react'
import styled from '@emotion/styled'
import { useTranslation } from 'react-i18next'
import { ChevronLeftIcon } from '@chakra-ui/icons'
import { RoutePath } from '../../route/path'
import { RouterLink } from '../RouterLink'

const ButtonContainer = styled(Button)`
  margin-left: 0;

  @media (max-width: 768px) {
    padding: 0;
    border: none;
    margin-left: 16px;
    border-radius: 0;
    &:hover {
      background-color: transparent;
    }
  }
`

export const GotoInbox: React.FC = () => {
  const [t] = useTranslation('common')
  return (
    <RouterLink href={RoutePath.Home} passHref>
      <ButtonContainer
        flex="1"
        borderRadius="56px"
        bg="white"
        border="2px solid black"
        _hover={{
          bg: '#E7E7E7',
        }}
        as="a"
      >
        <HStack spacing="4px">
          <ChevronLeftIcon boxSize="20px" />
          <Text fontWeight="bold" fontSize="20px">
            {t('navbar.inbox')}
          </Text>
        </HStack>
      </ButtonContainer>
    </RouterLink>
  )
}
