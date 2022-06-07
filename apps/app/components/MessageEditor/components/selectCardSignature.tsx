import {
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Image,
  Box,
  Skeleton,
} from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { CardSignature } from 'ui'
import React from 'react'
import { useCardSignature } from '../hooks/useCardSignature'
import { useSubject } from '../hooks/useSubject'
import { removeMailSuffix } from '../../../utils'

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
  const {
    isEnableCardSignature,
    setIsEnableCardSignature,
    ref: cardSignatureRef,
    blobUrl,
  } = useCardSignature([`${fromAddress}`])
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
          {isEnableCardSignature ? (
            <Image
              src={blobUrl}
              w="200px"
              h="auto"
              fallback={<Skeleton w="200px" h="188px" />}
            />
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
      {isEnableCardSignature && fromAddress ? (
        <Box position="fixed" top="0" left="0" opacity="0">
          <CardSignature
            account={removeMailSuffix(fromAddress)}
            ref={cardSignatureRef}
          />
        </Box>
      ) : null}
    </Flex>
  )
}
