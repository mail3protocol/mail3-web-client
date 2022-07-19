import {
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Box,
} from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import React from 'react'
import { CardSignature } from '../../CardSignature'
import { useCardSignature } from '../hooks/useCardSignature'
import { useSubject } from '../hooks/useSubject'
import { removeMailSuffix } from '../../../utils'

export const CARD_SIGNATURE_ID = 'CardSignature'

export const SelectCardSignature: React.FC = () => {
  const { fromAddress } = useSubject()
  const list = [
    {
      key: 'mail3.me',
      value: true,
    },
    {
      key: 'No signature card',
      value: false,
    },
  ]
  const { isEnableCardSignature, setIsEnableCardSignature } = useCardSignature()
  return (
    <Flex flexDirection="column" mr="auto" minW="200px">
      <Menu>
        <MenuButton
          as={Button}
          fontSize="14px"
          variant="unstyled"
          color={isEnableCardSignature ? '#000' : '#4E52F5'}
          h="auto"
        >
          <Flex align="center" px="20px" justify="center">
            {list[isEnableCardSignature ? 0 : 1].key}
            <ChevronDownIcon ml="6px" />
          </Flex>
          {isEnableCardSignature && fromAddress ? (
            <Box id={CARD_SIGNATURE_ID}>
              <CardSignature account={removeMailSuffix(fromAddress)} />
            </Box>
          ) : null}
        </MenuButton>
        <MenuList
          border="none"
          shadow="0 0px 16px 12px rgba(192, 192, 192, 0.25)"
          minW="220px"
          p="10px"
          rounded="8px"
          maxW="min(460px, 100vw)"
        >
          {list.map((item) => (
            <MenuItem
              key={item.key}
              position="relative"
              color="#000"
              zIndex={1}
              _focus={{
                bg: '#E7E7E7',
              }}
              rounded="4px"
              fontSize="12px"
              minH="40px"
              h="auto"
              px="10px"
              onClick={() => setIsEnableCardSignature(item.value)}
            >
              <Box whiteSpace="pre-line" w="full">
                {item.key}
              </Box>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Flex>
  )
}
